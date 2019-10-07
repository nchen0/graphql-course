import { message, getGreeting } from "./myModule";
import defaulted from "./myModule";
import sum, {substract} from "./math";

console.log(message);
console.log(defaulted);
console.log(getGreeting(message))
console.log(sum(1, 2));
console.log(substract(3, 2));