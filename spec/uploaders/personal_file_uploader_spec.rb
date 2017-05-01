require 'spec_helper'

describe PersonalFileUploader do
  let(:uploader) { described_class.new(build_stubbed(:empty_project)) }

  describe '.absolute_path' do
    it 'returns the correct absolute path by building it dynamically' do
      snippet = create(:personal_snippet)
      upload = double(model: snippet, path: 'secret/foo.jpg')

      dynamic_segment = "personal_snippet/#{snippet.id}"

      expect(described_class.absolute_path(upload)).to end_with("#{dynamic_segment}/secret/foo.jpg")
    end
  end

  describe '#to_h' do
    it 'returns the hahs' do
      snippet = create(:personal_snippet)
      uploader = described_class.new(snippet, 'secret')

      allow(uploader).to receive(:file).and_return(double(extension: 'txt', filename: 'file_name'))
      expected_url = "/uploads/personal_snippet/#{snippet.id}/secret/file_name"

      expect(uploader.to_h).to eq(
        alt: 'file_name',
        url: expected_url,
        markdown: "[file_name](#{expected_url})"
      )
    end
  end
end
