export const create = (model, data) => {
  return model.create(data);
};

export const findOne = (model, filter) => {
  return model.findOne(filter);
};

export const find = (model, filter) => {
  return model.find(filter);
};

export const findById = (model, id) => {
  return model.findById(id);
};

export const deleteOne = (model, filter) => {
  return model.deleteOne(filter);
};

export const findByIdAndUpdate = (model, id, updateData) => {
  return model.findByIdAndUpdate(id, updateData, { new: true });
};

export const findByIdAndDelete = (model, id) => {
  return model.findByIdAndDelete(id);
};
