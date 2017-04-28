RSpec::Matchers.define :gitlab_git_repository_with do |values|
  match do |actual|
    actual.is_a?(Gitlab::Git::Repository) &&
      values.reduce(true) { |r, (k, v)| r && actual.send(k) == v }
  end
end
