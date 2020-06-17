import {Skill} from "@app/Skills";

interface SkillLevelDefinitions {
    readonly skill: Skill;
    readonly required: boolean;
}

export class SkillLevel {
    private _skills: Array<SkillLevelDefinitions> = [];
    private _parent: SkillLevel | null = null;
    private _next: SkillLevel | null = null;
    private _requiredSkillCountToAdvanceToNextLevel: number = 0;

    constructor(public readonly name: string) {
    }

    public addSkill(skill: Skill, required: boolean = false): SkillLevel {
        this._skills.push({skill, required});
        return this;
    }

    public setNext(next: SkillLevel, requiredSkillCount: number) {
        next._parent = this;
        this._next = next;
        this._requiredSkillCountToAdvanceToNextLevel = requiredSkillCount;
    }

    public canAdvanceToNext(knownSkillCount: number): boolean {
        return knownSkillCount >= this._requiredSkillCountToAdvanceToNextLevel;
    }

    public get skills() {
        return this._skills;
    }

    public get next() {
        return this._next;
    }

    public get parent() {
        return this._parent;
    }

    public get skillCountToNext() {
        return this._requiredSkillCountToAdvanceToNextLevel;
    }

}

export class Talent {
    constructor(public readonly name: string, public readonly root: SkillLevel) {
    }

    public getLearnableSkills(myKnowledge: Array<Skill>): Array<Skill> {
        const learnableSkills: Array<Skill> = [];
        let node: SkillLevel | null = this.root;

        while (node !== null) {
            let knownSkillCount = 0;
            let missRequiredSkill = false;

            for (const {skill, required} of node.skills) {
                if (myKnowledge.includes(skill)) {
                    knownSkillCount++;
                } else {
                    if (required) {
                        missRequiredSkill = true;
                    }

                    if (Talent.skillCanBeLearnt(myKnowledge, skill)) {
                        learnableSkills.push(skill);
                    }
                }
            }

            if (!missRequiredSkill && node.canAdvanceToNext(knownSkillCount)) {
                node = node.next;
            } else {
                break;
            }
        }

        return learnableSkills;
    }

    private static skillCanBeLearnt(myKnowledge: Array<Skill>, skill: Skill): boolean {
        if (skill.dependency) {
            switch (skill.dependency.kind) {
                case "single":
                    if ((skill.dependency.type === "required") && !myKnowledge.includes(skill.dependency.skill)) {
                        return false
                    }
                    break;
                case "group":
                    switch (skill.dependency.type) {
                        case "all":
                            const knowsAll = skill.dependency.skills.every(s => myKnowledge.includes(s));
                            if (!knowsAll) {
                                return false;
                            }
                            break;
                        case "one-of":
                            const knowSome = skill.dependency.skills.some(s => myKnowledge.includes(s));
                            if (!knowSome) {
                                return false;
                            }
                    }
                    break;
            }
        }

        return true;
    }
}

export class Profession {
    constructor(public readonly name: string, public readonly talents: Array<Talent>) {
    }
}
