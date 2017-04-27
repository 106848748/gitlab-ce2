class JobsSerializer < BaseSerializer
  Item = Struct.new(:name, :size, :list)

  entity BuildEntity

  def with_groups
    tap { @groups = true }
  end

  def groups?
    @groups
  end

  def represent(resource, opts = {})
    if groups?
      groups(resource).map do |item|
        { name: item.name,
          size: item.size,
          list: super(item.list, opts),
          status: represent_status(item.list) }
      end
    else
      super(resource, opts)
    end
  end

  private

  def represent_status(list, opts = {})
    # TODO: We don't really have a first class concept
    # for JobsGroup that would make it possible to have status for that
    resource =
      if list.one?
        list.first.detailed_status(request.user)
      else
        Gitlab::Ci::Status::Group::Factory
            .new(CommitStatus.where(id: list), request.user)
            .fabricate!
      end

    StatusEntity
      .represent(resource, opts.merge(request: @request))
      .as_json
  end

  def groups(resource)
    items = resource.sort_by(&:sortable_name).group_by(&:group_name)

    items.map do |group_name, group_jobs|
      Item.new(group_name, group_jobs.size, group_jobs)
    end
  end
end
