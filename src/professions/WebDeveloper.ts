import {SkillLevel, Profession, Talent} from "@app/professions/Profession";
import {
    Angular,
    CoffeeScript,
    CSS, Django,
    HTML,
    Java,
    JavaScript, MySQL,
    NodeJS, PostgreSQL,
    Python, RabbitMQ,
    React, Redis,
    Ruby, RubyOnRails, Spring,
    SQL, SQLite,
    TypeScript,
    VueJS,
} from "@app/Skills";

const feBasics = new SkillLevel("Basics")
    .addSkill(HTML, true)
    .addSkill(CSS, true);

const feDynamic = new SkillLevel("Dynamic")
    .addSkill(JavaScript)
    .addSkill(CoffeeScript)
    .addSkill(TypeScript);

const feFrameworks = new SkillLevel("Frameworks")
    .addSkill(React)
    .addSkill(Angular)
    .addSkill(VueJS);

feBasics.setNext(feDynamic, 2);
feDynamic.setNext(feFrameworks, 1);

const FrontEndDeveloper = new Talent("Front End Developer", feBasics);

const beBasics = new SkillLevel("Basics")
    .addSkill(SQL, true)
    .addSkill(JavaScript)
    .addSkill(TypeScript)
    .addSkill(CoffeeScript)
    .addSkill(Ruby)
    .addSkill(Python)
    .addSkill(Java);

const beFrameworks = new SkillLevel("Frameworks")
    .addSkill(NodeJS)
    .addSkill(Django)
    .addSkill(RubyOnRails)
    .addSkill(Spring);

const beDatabases = new SkillLevel("Databases")
    .addSkill(PostgreSQL)
    .addSkill(MySQL)
    .addSkill(SQLite);

const beData = new SkillLevel("Data")
    .addSkill(Redis)
    .addSkill(RabbitMQ);

beBasics.setNext(beFrameworks, 2);
beFrameworks.setNext(beDatabases, 1);
beDatabases.setNext(beData, 1);

const BackEndDeveloper = new Talent("Back End Developer", beBasics);

const WebDeveloper = new Profession("Web Developer", [FrontEndDeveloper, BackEndDeveloper]);

export default WebDeveloper;
