require 'spec_helper'

describe Projects::BuildsController do
  include ApiHelpers

  let(:user) { create(:user) }
  let(:project) { create(:empty_project, :public) }
  let(:pipeline) { create(:ci_pipeline, project: project) }

  before do
    sign_in(user)
  end

  describe 'GET trace.json' do
    let(:build) { create(:ci_build, pipeline: pipeline) }

    before do
      allow_any_instance_of(Gitlab::Ci::Trace).to receive(:current_path).and_return(expand_fixture_path('trace/ansi-sequence-and-unicode'))

      get_trace
    end

    it 'traces build log' do
      expect(response).to have_http_status(:ok)
      expect(json_response['id']).to eq build.id
      expect(json_response['status']).to eq build.status
      expect(json_response['html']).to include("ヾ(´༎ຶД༎ຶ`)ﾉ")
    end

    def get_trace
      get :trace, namespace_id: project.namespace,
                  project_id: project,
                  id: build.id,
                  format: :json
    end
  end
end
