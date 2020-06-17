interface SingleDependency {
    readonly kind: "single";
    readonly skill: Skill;
    readonly type: "required" | "recommended";
}

interface GroupDependency {
    readonly kind: "group";
    readonly skills: Array<Skill>;
    readonly type: "one-of" | "all";
}

type SkillDependency = SingleDependency | GroupDependency | null;

interface Property {
}

class PopularityProperty implements Property {
    // @ts-ignore
    constructor(private readonly ranks: { tiobe?: number; pypl?: number; redmond?: number }) {
    }
}

type SkillType =
    "markup-language"
    | "style-sheet-language"
    | "programming-language"
    | "query-language"
    | "runtime-environment"
    | "framework"
    | "database"
    | "message-broker";

export class Skill {
    private _hash: string;

    constructor(public readonly type: SkillType, public readonly name: string, public readonly description: string, public readonly dependency: SkillDependency = null, public readonly properties: Array<Property> = [], public readonly metadata: { [key: string]: any } = {}) {
    }

    public get hash(): string {
        if (!this._hash) {
            this._hash = this.name.toLowerCase().replace(/\+g/, "p").replace(/[ \.]/g, "-");
        }
        return this._hash;
    }
}

export const HTML = new Skill("markup-language", "HTML", "Hypertext Markup Language is the standard markup language for documents designed to be displayed in a web browser. It can be assisted by technologies such as Cascading Style Sheets and scripting languages such as JavaScript, ASP and PHP. ");

export const CSS = new Skill("style-sheet-language", "CSS", "Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language like HTML. CSS is a cornerstone technology of the World Wide Web, alongside HTML and JavaScript.",
    {kind: "single", skill: HTML, type: "required"}, [new PopularityProperty({redmond: 7})])

export const SQL = new Skill("query-language", "SQL", "SQL is a domain-specific language used in programming and designed for managing data held in a relational database management system, or for stream processing in a relational data stream management system.",
    null, [new PopularityProperty({tiobe: 10})]);

// export const GraphQL = new Skill("query-language", "GraphQL");

// export const C = new Skill("programming-language", "C", null, [new PopularityProperty({tiobe: 1, pypl: 6})]);

// export const Cpp = new Skill("programming-language", "C++", null, [new PopularityProperty({
//     tiobe: 4,
//     pypl: 6,
//     redmond: 6
// })]);

export const JavaScript = new Skill("programming-language", "JavaScript", "JavaScript, often abbreviated as JS, is a programming language that conforms to the ECMAScript specification. JavaScript is high-level, often just-in-time compiled, and multi-paradigm. It has curly-bracket syntax, dynamic typing, prototype-based object-orientation, and first-class functions.",
    null, [new PopularityProperty({tiobe: 7, pypl: 3, redmond: 1})]);

export const TypeScript = new Skill("programming-language", "TypeScript", "TypeScript is an open-source programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript and adds optional static typing to the language. TypeScript is designed for development of large applications and transcompiles to JavaScript.",
    {kind: "single", skill: JavaScript, type: "recommended"}, [new PopularityProperty({
        tiobe: 44,
        pypl: 10,
        redmond: 9
    })]);

export const CoffeeScript = new Skill("programming-language", "CoffeeScript", "CoffeeScript is a programming language that compiles to JavaScript. It adds syntactic sugar inspired by Ruby, Python and Haskell in an effort to enhance JavaScript's brevity and readability. Specific additional features include list comprehension and destructuring assignment.",
    {kind: "single", skill: JavaScript, type: "recommended"});

export const Java = new Skill("programming-language", "Java", "Java is a general-purpose programming language that is class-based, object-oriented, and designed to have as few implementation dependencies as possible.",
    null, [new PopularityProperty({tiobe: 2, pypl: 2, redmond: 2})]);

export const Python = new Skill("programming-language", "Python", "Python is an interpreted, high-level, general-purpose programming language. Created by Guido van Rossum and first released in 1991, Python's design philosophy emphasizes code readability with its notable use of significant whitespace.",
    null, [new PopularityProperty({tiobe: 3, pypl: 1, redmond: 2})]);

export const Ruby = new Skill("programming-language", "Ruby", "Ruby is an interpreted, high-level, general-purpose programming language. It was designed and developed in the mid-1990s by Yukihiro \"Matz\" Matsumoto in Japan. Ruby is dynamically typed and uses garbage collection.",
    null, [new PopularityProperty({tiobe: 13, pypl: 15, redmond: 7})]);

// export const PHP = new ProgrammingLanguage("PHP", [], {tiobe_index: 8, pypl_rank: 5, redmonk_rank: 4});
// export const Swift = new ProgrammingLanguage("Swift", [], {tiobe_index: 11, pypl_rank: 9, redmonk_rank: 11});
// export const Rust = new ProgrammingLanguage("Rust", [], {tiobe_index: 20, pypl_rank: 18});
// export const CSharp = new ProgrammingLanguage("C#", [], {tiobe_index: 5, pypl_rank: 4, redmonk_rank: 5});
// export const VisualBasic = new ProgrammingLanguage("VisualBasic", [], {tiobe_index: 6, pypl_rank: 17})
// export const R = new ProgrammingLanguage("R", [], {tiobe_index: 9, pypl_rank: 7, redmonk_rank: 13});
// export const Go = new ProgrammingLanguage("Go", [], {tiobe_index: 12, pypl_rank: 13, redmonk_rank: 15});
// export const Assembly = new ProgrammingLanguage("Assembly", [], {tiobe_index: 14});
// export const ObjectiveC = new ProgrammingLanguage("Objective-C", [], {tiobe_index: 21, pypl_rank: 8, redmonk_rank: 12});
// export const MATLAB = new ProgrammingLanguage("MATLAB", [], {tiobe_index: 15, pypl_rank: 11});
// export const Kotlin = new ProgrammingLanguage("Kotlin", [], {tiobe_index: 30, pypl_rank: 12, redmonk_rank: 19});
// export const Dart = new ProgrammingLanguage("Dart", [], {tiobe_index: 25, pypl_rank: 19});
// export const Perl = new ProgrammingLanguage("Perl", [], {tiobe_index: 16, pypl_rank: 20, redmonk_rank: 18});
// export const Lua = new ProgrammingLanguage("Lua", [], {tiobe_index: 38, pypl_rank: 22});
// export const Scala = new ProgrammingLanguage("Scala", [], {tiobe_index: 32, pypl_rank: 16, redmonk_rank: 13});
// export const Haskell = new ProgrammingLanguage("Haskell", [], {tiobe_index: 46, pypl_rank: 27, redmonk_rank: 20});

export const NodeJS = new Skill("runtime-environment", "Node.js", "Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser.",
    {kind: "group", skills: [JavaScript, TypeScript, CoffeeScript], type: "one-of"});

export const RubyOnRails = new Skill("framework", "Ruby on Rails", "Ruby on Rails, or Rails, is a server-side web application framework written in Ruby under the MIT License. Rails is a model–view–controller framework, providing default structures for a database, a web service, and web pages.",
    {kind: "single", skill: Ruby, type: "required"});

export const Django = new Skill("framework", "Django", "Django is a Python-based free and open-source web framework that follows the model-template-view architectural pattern. It is maintained by the Django Software Foundation, an American independent organization established as a 501 non-profit.",
    {kind: "single", skill: Python, type: "required"});

export const Spring = new Skill("framework", "Spring", "The Spring Framework is an application framework and inversion of control container for the Java platform. The framework's core features can be used by any Java application, but there are extensions for building web applications on top of the Java EE platform.",
    {kind: "single", skill: Java, type: "required"});

export const React = new Skill("framework", "React", "React is an open-source JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.",
    {kind: "group", skills: [JavaScript, TypeScript, CoffeeScript], type: "one-of"});

export const Angular = new Skill("framework", "Angular", "Angular is a TypeScript-based open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations. Angular is a complete rewrite from the same team that built AngularJS. ",
    {kind: "group", skills: [JavaScript, TypeScript, CoffeeScript], type: "one-of"});

export const VueJS = new Skill("framework", "VueJS", "Vue.js is an open-source model–view–viewmodel JavaScript framework for building user interfaces and single-page applications. It was created by Evan You, and is maintained by him and the rest of the active core team members coming from various companies such as Netlify and Netguru.",
    {kind: "group", skills: [JavaScript, TypeScript, CoffeeScript], type: "one-of"});

export const PostgreSQL = new Skill("database", "PostgreSQL", "PostgreSQL, also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance. It was originally named POSTGRES, referring to its origins as a successor to the Ingres database developed at the University of California, Berkeley.",
    {kind: "single", skill: SQL, type: "required"}, [], [{type: "relational"}]);

export const SQLite = new Skill("database", "SQLite", "SQLite is a relational database management system contained in a C library. In contrast to many other database management systems, SQLite is not a client–server database engine. Rather, it is embedded into the end program.",
    {kind: "single", skill: SQL, type: "required"}, [], [{type: "relational"}]);

export const MySQL = new Skill("database", "MySQL", "MySQL is an open-source relational database management system. Its name is a combination of \"My\", the name of co-founder Michael Widenius's daughter, and \"SQL\", the abbreviation for Structured Query Language.",
    {kind: "single", skill: SQL, type: "required"}, [], [{type: "relational"}]);

// export const MongoDB = new Skill("database", "MongoDB", null, [], {type: "document-oriented"});

export const Redis = new Skill("database", "Redis", "Redis is an in-memory data structure project implementing a distributed, in-memory key–value database with optional durability. Redis supports different kinds of abstract data structures, such as strings, lists, maps, sets, sorted sets, HyperLogLogs, bitmaps, streams, and spatial indexes.",
    null, [], {type: "key-value"});

// export const Cassandra = new Skill("database", "Cassandra", null, [], {type: "wide-column"});

export const RabbitMQ = new Skill("message-broker", "RabbitMQ", "RabbitMQ is an open-source message-broker software that originally implemented the Advanced Message Queuing Protocol and has since been extended with a plug-in architecture to support Streaming Text Oriented Messaging Protocol, MQ Telemetry Transport, and other protocols.");
