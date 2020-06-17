import React, {useState} from "react";
import {Helmet} from "react-helmet";
import classNames from "classnames";
import PROFESSIONS from "@app/professions";
import {SkillLevel, Talent} from "@app/professions/Profession";
import Tooltip from "rc-tooltip";
import {Skill} from "@app/Skills";

type SkillRelation = "available" | "unavailable" | "know";

function get_skill_relation(skill: Skill, myKnowledge: Array<Skill>, learnableSkills: Array<Skill>): SkillRelation {
    if (myKnowledge.includes(skill)) {
        return "know";
    } else if (learnableSkills.includes(skill)) {
        return "available";
    }
    return "unavailable";
}

function get_skill_type(skill: Skill): string {
    switch (skill.type) {
        case "database":
            return "Database";
        case "framework":
            return "Framework";
        case "markup-language":
            return "Markup Language";
        case "message-broker":
            return "Message Broker";
        case "programming-language":
            return "Programming Language";
        case "query-language":
            return "Query Language";
        case "runtime-environment":
            return "Runtime Environment";
        case "style-sheet-language":
            return "Style-Sheet Language";
    }
}

function SkillIcon({skill}: { skill: Skill }) {
    return (
        <i className={classNames("skill-icon", `skill-icon-${skill.hash}`)}/>
    )
}

function ProfessionSelectionComponent({value, onChange}: { value?: number, onChange: (value: number | undefined) => void; }) {
    return (
        <select
            onChange={e => onChange(e.currentTarget.value === "-1" ? undefined : parseInt(e.currentTarget.value, 10))}
            value={value}>
            <option key={-1} value={-1}>No body</option>
            {PROFESSIONS.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
        </select>
    )
}

function TalentSkillComponent({skill, required, relation, level, onLearnSkill}: { skill: Skill; required: boolean; relation: SkillRelation, level: SkillLevel, onLearnSkill: (skill: Skill) => void; }) {
    let recommendedKnowledgeBlock = null;
    let requiredKnowledgeBlock = null;
    let requiredSkillBlock = null;
    let helpBlock = null;

    if (relation === "unavailable") {
        if (skill.dependency) {
            switch (skill.dependency.kind) {
                case "single":
                    switch (skill.dependency.type) {
                        case "required":
                            requiredKnowledgeBlock = (
                                <div className="required">
                                    Required Skill: <span className="dependency">{skill.dependency.skill.name}</span>
                                </div>
                            );
                            break
                        case "recommended":
                            recommendedKnowledgeBlock = (
                                <div className="recommended">
                                    Recommended Skill: <span className="dependency">{skill.dependency.skill.name}</span>
                                </div>
                            );
                            break;
                    }
                    break;
                case "group":
                    switch (skill.dependency.type) {
                        case "all":
                            requiredKnowledgeBlock = (
                                <div className="required">
                                    Requires knowledge of: <span
                                    className="dependency">{skill.dependency.skills.map(s => s.name).join(", ")}</span>
                                </div>
                            );
                            break;
                        case "one-of":
                            requiredKnowledgeBlock = (
                                <div className="required">
                                    Requires knowledge of at least one of: <span
                                    className="dependency">{skill.dependency.skills.map(s => s.name).join(", ")}</span>
                                </div>
                            );
                            break
                    }
                    break
            }
        }

        if ((level.parent !== null) && (level.parent.skillCountToNext !== 0)) {
            requiredSkillBlock = (
                <div className="required">
                    Requires at least {level.parent.skillCountToNext} skills from {level.parent.name} level
                </div>
            )
        }
    } else if (relation === "available") {
        if (skill.dependency && (skill.dependency.kind === "single") && (skill.dependency.type === "recommended")) {
            recommendedKnowledgeBlock = (
                <div className="recommended">Recommended Skill: {skill.dependency.skill.name}</div>
            );
        }

        helpBlock = (
            <div className="help">
                Click to learn
            </div>
        );
    }

    const overlay = (
        <div className="skill-overlay">
            <div className="heading">
                <div className="skill-name">{skill.name}</div>
                <div className="skill-type">{get_skill_type(skill)}</div>
            </div>
            <div className="tree-level">Level: {level.name}</div>
            {required ? <div className="must-learn">Required to progress further</div> : null}
            <div className="description">{skill.description}</div>
            <div className="knowledge">
                {recommendedKnowledgeBlock}
                {requiredKnowledgeBlock}
                {requiredSkillBlock}
            </div>
            {helpBlock}
        </div>
    );

    return (
        <Tooltip placement="top" trigger={["hover"]} overlay={overlay} destroyTooltipOnHide={{keepParent: false}}>
            <div
                className={classNames("profession-talent-tree-level-skill", `skill-${relation}`, {"skill-required": required})}
                onClick={() => onLearnSkill(skill)}>
                <SkillIcon skill={skill}/>
            </div>
        </Tooltip>
    )
}

function TalentSkillLevelComponent({level, myKnowledge, learnableSkills, onLearnSkill}: { level: SkillLevel; onLearnSkill: (skill: Skill) => void; myKnowledge: Array<Skill>; learnableSkills: Array<Skill>; }) {
    return (
        <div className="profession-talent-tree-level">
            {level.skills.map(({skill, required}, index) => <TalentSkillComponent key={index} skill={skill}
                                                                                  required={required} level={level}
                                                                                  relation={get_skill_relation(skill, myKnowledge, learnableSkills)}
                                                                                  onLearnSkill={onLearnSkill}/>)}
        </div>
    )
}

function ProfessionTalentContainer({talent, myKnowledge, onLearnSkill}: { talent: Talent; myKnowledge: Array<Skill>; onLearnSkill: (skill: Skill) => void; }) {
    const levels = [];
    let node: SkillLevel | null = talent.root;
    let index = 0;

    const learnableSkills = talent.getLearnableSkills(myKnowledge);

    while (node !== null) {
        levels.push(<TalentSkillLevelComponent key={index} level={node} onLearnSkill={onLearnSkill}
                                               myKnowledge={myKnowledge}
                                               learnableSkills={learnableSkills}/>);
        node = node.next;
        index++;
    }

    return (
        <div className="profession-talent">
            <h2>{talent.name}</h2>
            <div className="profession-talent-tree">
                {levels}
            </div>
        </div>
    )
}

function ProfessionContainer({professionId}: { professionId: number }) {
    const [myKnowledge, setMyKnowledge] = useState<Array<Skill>>([]);

    const profession = PROFESSIONS[professionId];

    const onLearnSkill = (skill: Skill) => setMyKnowledge([...myKnowledge, skill]);

    return (
        <div className="profession">
            {profession.talents.map((talent, i) => <ProfessionTalentContainer key={i} talent={talent}
                                                                              myKnowledge={myKnowledge}
                                                                              onLearnSkill={onLearnSkill}/>)}
        </div>
    )
}

export default function ApplicationContainer() {
    const [professionId, setProfessionId] = useState<number | undefined>(undefined);

    return (
        <>
            <div className="content">
                <Helmet title="Welcome"/>
                <h1 className="title">Welcome to the Dungeon. Who do you want to become?</h1>

                <div className="description">
                    I want to become a <ProfessionSelectionComponent value={professionId} onChange={setProfessionId}/>
                </div>
                <div className="container">
                    {(professionId !== undefined) ? <ProfessionContainer professionId={professionId}/> : null}
                </div>
            </div>

            <div className="footer">
                <div className="disclaimer">
                    This web site is NOT intended to be a guide or serve as a recommendation for career path. It was
                    created purely for entertainment purposes and should not be treated seriously.
                </div>
                <div className="license">
                    All language, framework, runtime environments, databases and other images are licensed under <a
                    href="https://creativecommons.org/licenses/by/3.0/" target="_blank">CC BY 3.0 license</a>.
                    Descriptions are copied from <a href="https://www.wikipedia.org/" target="_blank">Wikipedia</a>
                </div>
                <div className="author">
                    Made with ❤️ by <a href="https://github.com/skwee357" target="_blank">Dmitry Kudryavstev</a>. <a
                    href="https://github.com/skwee357/swe-talent-tree" target="_blank">Source Code on GitHub</a>
                </div>
            </div>
        </>
    )
}
