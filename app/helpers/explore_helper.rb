module ExploreHelper
  def filter_projects_path(options = {})
    exist_opts = {
      sort: params[:sort],
      scope: params[:scope],
      group: params[:group],
      tag: params[:tag],
      visibility_level: params[:visibility_level],
    }

    options = exist_opts.merge(options)
    request_path_with_options(options)
  end

  def filter_groups_path(options = {})
    request_path_with_options(options)
  end

  def explore_controller?
    controller.class.name.split("::").first == "Explore"
  end

  private

  def request_path_with_options(options = {})
    request.path + "?#{options.to_param}"
  end
end
