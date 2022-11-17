import Events from "./Events";
import Organisations from "./Organisations";
import Relationships from "./Relationships";
import Tags from "./Tags";

export default class Contacts {
  constructor(
    private age: number,
    private email: string,
    private id: string,
    private lastName: string,
    private postCode: string,
    private events?: Events[],
    private organisations?: Organisations[],
    private tags?: Tags[]
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
