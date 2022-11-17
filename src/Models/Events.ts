import Contacts from "./Contacts";
import Organisations from "./Organisations";
import Tags from "./Tags";

export default class Events {
  constructor(
    private eventDate: string,
    private id: string,
    private name: string,
    private postCode: string,
    private venueName: string,
    private contacts?: Contacts[],
    private organisations?: Organisations[],
    private tags?: Tags[]
  ) {}
}
