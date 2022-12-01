import IOrganisation from "./IOrganisation";
import Tags from "./ITag";
import IEvent from "./IEvent";

export default interface IContact {
  age?: string;
  email?: string;
  id?: string;
  lastName?: string;
  firstName?: string;
  postCode?: string;
  events?: IEvent[];
  organisations?: IOrganisation[];
  tags?: Tags[];
}
