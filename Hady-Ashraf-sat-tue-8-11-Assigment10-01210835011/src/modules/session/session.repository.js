import Session from "../../DB/models/session.model.js";
import * as db from "../../common/services/base.repository.js";

export const createSession = async (data) => {
  return await db.create(Session, data);
};

export const deleteSession = (filter) => {
  return db.deleteOne(Session, filter);
};

export const findSession = (filter) => {
  return db.findOne(Session, filter);
};
