import Events from "./Events";
import Organisations from "./Organisations";
import Relationships from "./Relationships";
import Tags from "./Tags";

export default class Contacts {
  constructor(
    public age: number,
    public email: string,
    public id: string,
    public lastName: string,
    public postCode: string,
    public events?: Events[],
    public organisations?: Organisations[],
    public tags?: Tags[],
    public name?: string
  ) {}

  GetEmail(): string {
    return this.email;
  }

  GetRelationships(): Relationships {
    return {
      events: this.events,
      organisations: this.organisations,
      tags: this.tags,
    };
  }
}
