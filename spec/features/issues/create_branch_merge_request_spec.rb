require 'rails_helper'

feature 'Create Branch/Merge Request Dropdown on issue page', feature: true, js: true do
  let(:user) { create(:user) }
  let(:project) { create(:project_empty_repo) }
  let(:issue) { create(:issue, project: project, title: 'Cherry-Coloured Funk') }

  context 'as an author' do
    before do
      project.team << [user, :developer]
      login_as(user)
      visit namespace_project_issue_path(project.namespace, project, issue)
    end

    it 'I can create a merge request from issue page' do
      select_dropdown_option('create-mr')

      wait_for_ajax

      expect(page).to have_content("created branch 1-cherry-coloured-funk")
      expect(page).to have_content("mentioned in merge request !1")

      visit namespace_project_merge_request_path(project.namespace, project, MergeRequest.first)

      expect(page).to have_content('WIP: Resolve "Cherry-Coloured Funk"')
      expect(current_path).to eq(namespace_project_merge_request_path(project.namespace, project, MergeRequest.first))
    end

    it 'I can creates a branch from issue page' do
      select_dropdown_option('create-branch')

      wait_for_ajax

      expect(page).to have_selector('.dropdown-toggle-text ', text: '1-cherry-coloured-funk')
      expect(current_path).to eq namespace_project_tree_path(project.namespace, project, '1-cherry-coloured-funk')
    end

    def select_dropdown_option(option)
      find('.create-mr-dropdown-wrap .dropdown-toggle').click
      find("li[data-value='#{option}']").click
      find('.js-create-merge-request').click
    end
  end

  context 'logged out' do
    before do
      visit namespace_project_issue_path(project.namespace, project, issue)
    end

    it 'does not have the dropdown' do
      expect(page).not_to have_selector('.create-mr-dropdown-wrap')
    end
  end
end
