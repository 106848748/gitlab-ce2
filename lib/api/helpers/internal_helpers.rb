module API
  module Helpers
    module InternalHelpers
      # Project paths may be any of the following:
      #   * /repository/storage/path/namespace/project
      #   * /namespace/project
      #   * namespace/project
      #
      # In addition, they may have a '.git' extension and multiple namespaces
      #
      # Transform all these cases to 'namespace/project'
      def clean_project_path(project_path, storages = Gitlab.config.repositories.storages.values)
        project_path = project_path.sub(/\.git\z/, '')

        storages.each do |storage|
          storage_path = File.expand_path(storage['path'])

          if project_path.start_with?(storage_path)
            project_path = project_path.sub(storage_path, '')
            break
          end
        end

        project_path.sub(/\A\//, '')
      end

      def wiki?
        set_project unless defined?(@wiki)
        @wiki
      end

      def project
        set_project unless defined?(@project)
        @project
      end

      def ssh_authentication_abilities
        [
          :read_project,
          :download_code,
          :push_code
        ]
      end

      def parse_env
        return {} if params[:env].blank?

        JSON.parse(params[:env])
      rescue JSON::ParserError
        {}
      end

      def log_user_activity(actor)
        commands = Gitlab::GitAccess::DOWNLOAD_COMMANDS

        ::Users::ActivityService.new(actor, 'Git SSH').execute if commands.include?(params[:action])
      end

      private

      def set_project
        if params[:gl_project]
          type, id = params[:gl_project].split('-')
          @project, @wiki = project_by_id(type, id)
        else
          project_path = clean_project_path(params[:project])
          @project, @wiki = project_by_path(project_path)
        end
      end

      def project_by_id(type, id)
        project = Project.find(id)
        wiki = type == 'wiki'

        [project, wiki]
      end

      def project_by_path(project_path)
        project = Project.find_by_full_path(project_path)
        # Check for *.wiki repositories.
        if project_path.end_with?('.wiki') && !project
          # Strip out the .wiki from the pathname before finding the
          # project. This applies the correct project permissions to
          # the wiki repository as well.
          project = Project.find_by_full_path(project_path.chomp('.wiki'))
          wiki = true
        else
          wiki = false
        end

        [project, wiki]
      end
    end
  end
end
