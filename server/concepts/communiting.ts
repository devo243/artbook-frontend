import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CommunityDoc extends BaseDoc {
  author: ObjectId;
  title: string;
  description: string;
  imageIconURL: string;
}

export interface CommunityMembersDoc extends BaseDoc {
  community: ObjectId;
  member: ObjectId;
}

/**
 * concept: Communiting [User, Item]
 */
export default class CommunitingConcept {
  public readonly communities: DocCollection<CommunityDoc>;
  public readonly communityMembers: DocCollection<CommunityMembersDoc>;

  constructor(collectionName: string) {
    this.communities = new DocCollection<CommunityDoc>(collectionName);
    this.communityMembers = new DocCollection<CommunityMembersDoc>(collectionName + '_members')
  }

  async create(author: ObjectId, title: string, description: string, imageIconURL: string) {
    await this.assertCommunityNotExists(title);

    const _id = await this.communities.createOne({ author, title, description, imageIconURL: imageIconURL });

    await this.communityMembers.createOne({ community: _id, member: author });

    return { msg: "Community Succesfully Created!", community: await this.communities.readOne({ _id }) };
  }

  async delete(_id: ObjectId) {
    await this.communities.deleteOne({ _id });
    await this.communityMembers.deleteMany({ community: _id })
    return { msg: "Community Succesfully Deleted!" };
  }

  async getCommunityByID(_id: ObjectId) {
    return await this.communities.readOne({ _id });
  }

  async getCommunities() {
    return await this.communities.readMany({}, { sort: { _id: -1 } });
  }

  async getCommunityByTitle(title: string) {
    return await this.communities.readOne({ title });
  }

  async getNumMembers(_id: ObjectId) {
    const members = await this.communityMembers.readMany({ community: _id });

    if (!members) {
      throw new NotFoundError(`Community ${_id} doesn't exist!`);
    }

    return { numMembers: members.length };
  }

  async join(user: ObjectId, _id: ObjectId) {
    await this.assertUserNotInCommunity(_id, user);

    await this.communityMembers.createOne({ community: _id, member: user});
    return { msg: "A user has joined the community!" };
  }

  async leave(user: ObjectId, _id: ObjectId) {
    await this.assertUserInCommunity(_id, user);

    await this.communityMembers.deleteOne({ community: _id, member: user});
    return { msg: "A user has left the community!" };
  }

  async getUserCommunities(user: ObjectId) {
    const userCommunities = await this.communityMembers.readMany({ member: user });

    return Promise.all(userCommunities.map(async c => {return await this.getCommunityByID(c.community)}));
  }

  private checkObjectIdInArray(_id: ObjectId, arr: ObjectId[]) {
    for (const id of arr) {
      if (_id.equals(id)) {
        return true;
      }
    }

    return false;
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const community = await this.getCommunityByID(_id);

    if (!community) {
      throw new NotFoundError(`Community ${_id} doesn't exist!`);
    }

    if (community.author.toString() !== user.toString()) {
      throw new CommunityAuthorNoMatchError(user, _id);
    }
  }

  async assertUserInCommunity(_id: ObjectId, user: ObjectId) {
    const community = await this.getCommunityByID(_id);

    if (!community) {
      throw new NotFoundError(`Community ${_id} doesn't exist!`);
    }

    const member = await this.communityMembers.readOne({ community: _id, member: user});

    if (!member) {
      throw new CommunityUserNoMatchError(user, _id);
    }
  }

  async assertUserNotInCommunity(_id: ObjectId, user: ObjectId) {
    const community = await this.getCommunityByID(_id);

    if (!community) {
      throw new NotFoundError(`Community ${_id} doesn't exist!`);
    }

    const member = await this.communityMembers.readOne({ community: _id, member: user});

    if (member) {
      throw new CommunityMemberExistsError(user, _id);
    }
  }

  async assertCommunityNotExists(title: string) {
    const community = await this.getCommunityByTitle(title);

    if (community) {
      throw new NotAllowedError("Community already exists!");
    }
  }

  async assertCommunityExists(_id: ObjectId) {
    const community = await this.getCommunityByID(_id);

    if (!community) {
      throw new NotFoundError("Community doesn't exist!");
    }
  }
}

export class CommunityAuthorNoMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of community {1}", author, _id);
  }
}

export class CommunityUserNoMatchError extends NotFoundError {
  constructor(
    public readonly member: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not a member of community {1}", member, _id);
  }
}

export class CommunityMemberExistsError extends NotAllowedError {
  constructor(
    public readonly member: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is already a member of community {1}", member, _id);
  }
}
