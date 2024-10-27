import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface FeaturingDoc extends BaseDoc {
  item: ObjectId;
}

/**
 * concept: Featuring [Item, Number]
 */
export default class FeaturingConcept {
  public readonly features: DocCollection<FeaturingDoc>;
  public readonly minimumAttention: number;
  public readonly timeLimit: number;

  constructor(collectionName: string, minimumAttention: number, dayLimit: number) {
    this.features = new DocCollection<FeaturingDoc>(collectionName);
    this.minimumAttention = minimumAttention;
    this.timeLimit = dayLimit * 24 * 60 * 60;
  }

  async promote(item: ObjectId, attention: number) {
    await this.assertItemIsNotFeatured(item);

    if (attention >= this.minimumAttention) {
      await this.features.createOne({ item: item });

      return { msg: "An item has been added to a feed!" };
    } else {
      return { msg: "The item didn't meet the minimum attention." };
    }
  }

  async depromote(item: ObjectId, attention: number) {
    await this.assertItemIsFeatured(item);

    if (attention < this.minimumAttention) {
      await this.features.deleteOne({ item: item });
      return { msg: "An item has been depromoted" };
    } else {
      return { msg: "The item still has the minimum attention." };
    }
  }

  async checkPromoted() {
    const features = await this.features.readMany({});

    const currentTime = new Date();

    await Promise.all(
      features.map(async (feature) => {
        const timeDiff = (currentTime.getTime() - feature.dateCreated.getTime()) / 1000;

        if (timeDiff > this.timeLimit) {
          await this.features.deleteOne({ _id: feature._id });
        }
      }),
    );
  }

  async getFeatured() {
    await this.checkPromoted();

    return await this.features.readMany({});
  }

  async assertItemIsFeatured(item: ObjectId) {
    const feature = await this.features.readOne({ item: item });

    if (!feature) {
      throw new NotFoundError("Item is not featured!");
    } else {
      const currentTime = new Date();

      const timeDiff = (currentTime.getTime() - feature.dateCreated.getTime()) / 1000;

      if (timeDiff > this.timeLimit) {
        throw new NotAllowedError("Item is too old to be featured!");
      }
    }
  }

  async assertItemIsNotFeatured(item: ObjectId) {
    const feature = await this.features.readOne({ item: item });

    if (feature) {
      throw new NotAllowedError("Item is already featured!");
    }
  }
}
