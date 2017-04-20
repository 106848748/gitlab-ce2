module MarkdownActions
  extend ActiveSupport::Concern

  def preview_markdown
    text = params[:text]

    render json: {
      body: view_context.markdown(text, markdown_context),
      references: {
        users: preview_referenced_users(text)
      }
    }
  end

  private

  def markdown_context
    {}
  end

  def preview_referenced_users(text)
    extractor = Gitlab::ReferenceExtractor.new(@project, current_user)
    extractor.analyze(text, author: current_user)

    extractor.users.map(&:username)
  end
end
