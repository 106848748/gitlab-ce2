class StageEntity < Grape::Entity
  include RequestAwareEntity

  expose :name

  expose :title do |stage|
    "#{stage.name}: #{detailed_status.label}"
  end

  expose :detailed_status, as: :status, with: StatusEntity

  expose :path do |stage|
    namespace_project_pipeline_path(
      stage.pipeline.project.namespace,
      stage.pipeline.project,
      stage.pipeline,
      anchor: stage.name)
  end

  expose :dropdown_path do |stage|
    stage_namespace_project_pipeline_path(
      stage.pipeline.project.namespace,
      stage.pipeline.project,
      stage.pipeline,
      stage: stage.name,
      format: :json)
  end

  expose :jobs do |stage|
    JobsSerializer.new(project: request.project, user: request.user)
      .with_groups.represent(stage.statuses)
  end

  private

  alias_method :stage, :object

  def detailed_status
    stage.detailed_status(request.user)
  end
end
