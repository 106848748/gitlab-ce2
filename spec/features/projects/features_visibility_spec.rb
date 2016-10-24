require 'spec_helper'
include WaitForAjax

describe 'Edit Project Settings', feature: true do
  include WaitForAjax

  let(:member) { create(:user) }
  let!(:project) { create(:project, :public, path: 'gitlab', name: 'sample') }
  let!(:issue) { create(:issue, project: project) }
  let(:non_member) { create(:user) }

  describe 'project features visibility selectors', js: true do
    before do
      project.team << [member, :master]
      login_as(member)
    end

    tools = { builds: "pipelines", issues: "issues", wiki: "wiki", snippets: "snippets", merge_requests: "merge_requests" }

    tools.each do |tool_name, shortcut_name|
      describe "feature #{tool_name}" do
        it 'toggles visibility' do
          visit edit_namespace_project_path(project.namespace, project)

          select 'Disabled', from: "project_project_feature_attributes_#{tool_name}_access_level"
          click_button 'Save changes'
          wait_for_ajax
          expect(page).not_to have_selector(".shortcuts-#{shortcut_name}")

          select 'Everyone with access', from: "project_project_feature_attributes_#{tool_name}_access_level"
          click_button 'Save changes'
          wait_for_ajax
          expect(page).to have_selector(".shortcuts-#{shortcut_name}")

          select 'Only team members', from: "project_project_feature_attributes_#{tool_name}_access_level"
          click_button 'Save changes'
          wait_for_ajax
          expect(page).to have_selector(".shortcuts-#{shortcut_name}")

          sleep 0.1
        end
      end
    end
  end

  describe 'project features visibility pages' do
    before do
      @tools =
        {
          builds: namespace_project_pipelines_path(project.namespace, project),
          issues: namespace_project_issues_path(project.namespace, project),
          wiki: namespace_project_wiki_path(project.namespace, project, :home),
          snippets: namespace_project_snippets_path(project.namespace, project),
          merge_requests: namespace_project_merge_requests_path(project.namespace, project),
        }
    end

    context 'normal user' do
      it 'renders 200 if tool is enabled' do
        @tools.each do |method_name, url|
          project.project_feature.update_attribute("#{method_name}_access_level", ProjectFeature::ENABLED)
          visit url
          expect(page.status_code).to eq(200)
        end
      end

      it 'renders 404 if feature is disabled' do
        @tools.each do |method_name, url|
          project.project_feature.update_attribute("#{method_name}_access_level", ProjectFeature::DISABLED)
          visit url
          expect(page.status_code).to eq(404)
        end
      end

      it 'renders 404 if feature is enabled only for team members' do
        project.team.truncate

        @tools.each do |method_name, url|
          project.project_feature.update_attribute("#{method_name}_access_level", ProjectFeature::PRIVATE)
          visit url
          expect(page.status_code).to eq(404)
        end
      end

      it 'renders 200 if users is member of group' do
        group = create(:group)
        project.group = group
        project.save

        group.add_owner(member)

        @tools.each do |method_name, url|
          project.project_feature.update_attribute("#{method_name}_access_level", ProjectFeature::PRIVATE)
          visit url
          expect(page.status_code).to eq(200)
        end
      end
    end

    context 'admin user' do
      before do
        non_member.update_attribute(:role_type, 'admin')
        login_as(non_member)
      end

      it 'renders 404 if feature is disabled' do
        @tools.each do |method_name, url|
          project.project_feature.update_attribute("#{method_name}_access_level", ProjectFeature::DISABLED)
          visit url
          expect(page.status_code).to eq(404)
        end
      end

      it 'renders 200 if feature is enabled only for team members' do
        project.team.truncate

        @tools.each do |method_name, url|
          project.project_feature.update_attribute("#{method_name}_access_level", ProjectFeature::PRIVATE)
          visit url
          expect(page.status_code).to eq(200)
        end
      end
    end
  end

  describe 'repository visibility', js: true do
    before do
      project.team << [member, :master]
      login_as(member)
      visit edit_namespace_project_path(project.namespace, project)
    end

    it "disables repository related features" do
      select "Disabled", from: "project_project_feature_attributes_repository_access_level"

      expect(find(".edit-project")).to have_selector("select.disabled", count: 2)
    end

    it "shows empty features project homepage" do
      select "Disabled", from: "project_project_feature_attributes_repository_access_level"
      select "Disabled", from: "project_project_feature_attributes_issues_access_level"
      select "Disabled", from: "project_project_feature_attributes_wiki_access_level"

      click_button "Save changes"
      wait_for_ajax

      visit namespace_project_path(project.namespace, project)

      expect(page).to have_content "Customize your workflow!"
    end
  end
end
