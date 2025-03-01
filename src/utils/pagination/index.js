// --------------------------- pagination for Searsh-----------------------------------------------
export const pagination = async ({ page = 1 ,model, populate , sort = { createdAt : -1 } } = {}) => {
    let _page = parseInt(page) || 1;
    if (_page < 1) _page = 1;
    const limit = 2;
    const skip = (_page - 1) * limit;
    const totalCount = await model.countDocuments();

    const data = await model.find()
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate(populate).lean();
    return { data, _page, totalCount };
  };
  // --------------------------- pagination for AdvancedSearch -----------------------------------------------
  export const paginationBy = async ({ page = 1, filter = {} ,model, populate = [], sort = { createdAt : -1 } } = {}) => {
    let _page = parseInt(page) || 1;
    if (_page < 1) _page = 1;
    const limit = 2;
    const skip = (_page - 1) * limit;
    const totalCount = await model.countDocuments(filter);

    const data = await model.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate(populate).lean();
    return { data, _page, totalCount };
  };