class UploadsController < ApplicationController
  include UploadsActions

  skip_before_action :authenticate_user!
  before_action :find_model, :authorize_access!

  private

  def find_model
    return render_404 unless upload_model

    @model = upload_model.find(params[:id])
  end

  def authorize_access!
    authorized =
      case model
      when Project
        can?(current_user, :read_project, model)
      when Group
        can?(current_user, :read_group, model)
      when Note
        can?(current_user, :read_project, model.project)
      when PersonalSnippet
        can?(current_user, :read_personal_snippet, model)
      else
        # No authentication required for user avatars.
        true
      end

    return if authorized

    if current_user
      render_404
    else
      authenticate_user!
    end
  end

  def upload_model
    upload_models = {
      "user"    => User,
      "project" => Project,
      "note"    => Note,
      "group"   => Group,
      "appearance" => Appearance,
      "personal_snippet" => PersonalSnippet
    }

    upload_models[params[:model]]
  end

  def upload_mount
    upload_mounts = %w(avatar attachment file logo header_logo)

    if upload_mounts.include?(params[:mounted_as])
      params[:mounted_as]
    end
  end

  def uploader
    return @uploader if defined?(@uploader)

    if model.is_a?(PersonalSnippet)
      @uploader = PersonalFileUploader.new(model, params[:secret])

      @uploader.retrieve_from_store!(params[:filename])
    else
      @uploader = @model.send(upload_mount)

      redirect_to @uploader.url unless @uploader.file_storage?
    end

    @uploader
  end

  def uploader_class
    PersonalFileUploader
  end

  def model
    @model
  end
end
