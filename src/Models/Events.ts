import Contacts from "./Contacts";
import Organisations from "./Organisations";
import Tags from "./Tags";

export default class Events {
  constructor(
    public eventDate: string,
    public id: string,
    public name: string,
    public postCode: string,
    public venueName: string,
    public contacts?: Contacts[],
    public organisations?: Organisations[],
    public tags?: Tags[],
    public contactCount?: number
  ) {}
}
