# rubocop:disable all
class AddProjectsPublicIndex < ActiveRecord::Migration
  DOWNTIME = false

  def up
    add_index :namespaces, :public
  end

  def down
    # This one is removed in RemovePublicFromNamespace
    remove_index :namespaces, :public if index_exists?(:namespaces, :public)
  end
end
