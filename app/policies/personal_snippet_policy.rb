class PersonalSnippetPolicy < BasePolicy
  condition(:public_snippet, scope: :subject) { @subject.public? }
  condition(:is_author) { @user && @subject.author == @user }
  condition(:internal_snippet, scope: :subject) { @subject.internal? }

  rule { public_snippet }.enable :read_personal_snippet
  rule { is_author }.policy do
    enable :read_personal_snippet
    enable :update_personal_snippet
    enable :destroy_personal_snippet
    enable :admin_personal_snippet
  end

  rule { ~anonymous }.enable :create_personal_snippet
  rule { external_user }.prevent :create_personal_snippet
  rule { internal_snippet & ~external_user }.enable :read_personal_snippet
end
