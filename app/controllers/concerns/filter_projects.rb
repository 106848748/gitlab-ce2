# == FilterProjects
#
# Controller concern to handle projects filtering
# * by name
# * by archived state
#
module FilterProjects
  extend ActiveSupport::Concern

  def filter_projects(projects)
    projects = projects.search(params[:name]) if params[:name].present?
    projects = projects.non_archived if params[:archived].blank?
    projects = projects.personal(current_user) if params[:personal].present? && current_user

    projects
  end
end
