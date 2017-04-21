require 'delegate'

module Gitlab
  module GitalyClient
    class DiffIterator < SimpleDelegator
      def each_delta(&block)
        each(&block)
      end
    end
  end
end
