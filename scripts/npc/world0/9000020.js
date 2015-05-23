// /*
// 	This file is part of the OdinMS Maple Story Server
//     Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
// 		       Matthias Butz <matze@odinms.de>
// 		       Jan Christian Meyer <vimes@odinms.de>

//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU Affero General Public License as
//     published by the Free Software Foundation version 3 as published by
//     the Free Software Foundation. You may not use, modify or distribute
//     this program under any other version of the GNU Affero General Public
//     License.

//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU Affero General Public License for more details.

//     You should have received a copy of the GNU Affero General Public License
//     along with this program.  If not, see <http://www.gnu.org/licenses/>.
// */
// status = -1;

// function start() {
//     action(1,0,0);
// }

// function action(mode, type, selection) {
//     status++;
//     if(mode != 1){
//         if(mode == 0 && status == 4)
//             status -= 2;
//         else{
//             cm.dispose();
//             return;
//         }
//     }
//     if (cm.getPlayer().getMapId() == 800000000) {
//         if (status == 0) 
//             cm.sendSimple("How's the traveling? Are you enjoying it?#b\r\n#L0#Yes, I'm done with traveling. Can I go back to #m" + cm.getPlayer().getSavedLocation("WORLDTOUR") + "#?\r\n#L1#No, I'd like to continue exploring this place.");
//         else if (status == 1) {
//             if (selection == 0) {
//                 cm.sendNext("Alright. I'll take you back to where you were before the visit to Japan. If you ever feel like traveling again down the road, please let me know!");
//             } else if (selection == 1) {
//                 cm.sendOk("OK. If you ever change your mind, please let me know.");
//                 cm.dispose();
//             }
//         } else if (status == 2) {
//             var map = cm.getPlayer().getSavedLocation("WORLDTOUR");
//             if (map == undefined)
//                 map = 104000000;
//             cm.warp(map, parseInt(Math.random() * 5));
//             cm.dispose();
//         }
//     } else {
//         if (status == 0) 
//             cm.sendNext("If you're tired of the monotonous daily life, how about getting out for a change? there's nothing quite like soaking up a new culture, learning something new by the minute! It's time for you to get out and travel. We, at the Maple Travel Agency recommend you going on a #bWorld Tour#k! Are you worried about the travel expense? You shouldn't be! We, the #bMaple Travel Agency#k, havecarefully come up with a plan to let you travel for ONLY #b3,000 mesos#k!");
//         else if (status == 1) 
//             cm.sendSimple("We currently offer this place for you traveling pleasure: #bMushroom Shrine of Japan#k. I'll be there serving you as the travel guide. Rest assured, the number of destinations will be increase over time. Now, would you like to head over to the Mushroom Shrine?#b\r\n#L0#Yes, take me to Mushroom Shrine (Japan)");
//         else if (status == 2)
//             cm.sendNext("Would you like to travel to #bMushroom Shrine of Japan#k? If you desire to feel the essence of Japan, there's nothing like visiting the Shrine, a Japanese cultural melting pot. Mushroom Shrine is a mythical place that serves the incomparable Mushroom God from ancient times.");
//         else if (status == 3) {
//             if(cm.getMeso() < 3000){
//                 cm.sendNext("You don't have enough mesos to take the travel.");
//                 cm.dispose();
//                 return;
//             }
//             cm.sendNextPrev("Check out the female shaman serving the Mushroom God, and I strongly recommend trying Takoyaki, Yakisoba, and other delocious food sold in the streets of Japan. Now, let's head over to #bMushroom Shrine#k, a mythical place if there ever was one.");
//         } else if (status == 4) {
//             cm.gainMeso(-3000);
//             cm.getPlayer().saveLocation("WORLDTOUR");
//             cm.warp(800000000);
//             cm.dispose();
//         }
//     }
// }

var status = -1;
var possibleJobs = new Array();
var maps = [ /*BossMaps*/
    [211070000, 100000005, 105070002, 105090900, 230040420, 280030000, 220080000, 240020402, 240020101, 801040100, 240060200, 610010005, 610010012, 610010013, 610010100, 610010101, 610010102, 610010103, 610010104], /*MonsterMaps*/
    [682010203, 610040000, 610040100, 610040200, 610040210, 610040220, 610040230, 211060100, 211060300, 211060500, 211060700, 211060900, 100040001, 101010100, 104040000, 103000101, 103000105, 101030110, 106000002, 101030103, 101040001, 101040003, 101030001, 104010001, 105070001, 105090300, 105040306, 230020000, 230010400, 211041400, 222010000, 220080000, 220070301, 220070201, 220050300, 220010500, 250020000, 251010000, 200040000, 200010301, 240020100, 240040500, 240040000, 600020300, 801040004, 800020130, 800020400], /*Towns*/
    [130000000, 300000000, 1010000, 680000000, 230000000, 101000000, 211000000, 100000000, 251000000, 103000000, 222000000, 104000000, 240000000, 220000000, 250000000, 800000000, 600000000, 221000000, 200000000, 102000000, 801000000, 105040300, 610010004, 260000000, 540010000, 120000000]
];
var jobA = false;
var warper = false;
var job;
var newJob;
var chosenMap = -1;
var chosenSection = -1;

function start() {
    cm.sendSimple("#fUI/UIWindow.img/QuestIcon/3/0#\r\n#L0#World Tour#l");
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        cm.dispose();
        return;
    }
    if (!jobA && !warper)
        if (selection == 1) jobA = true;
        else warper = true;
    if (jobA) jobAdv(selection);
    else warp(selection);
}

function warp(selection) {
    if (status == 0) cm.sendSimple("#fUI/UIWindow.img/QuestIcon/3/0#\r\n#L0#Boss Maps#l\r\n#L1#Monster Maps#l\r\n#L2#Town Maps#l");
    else if (status == 1) {
        chosenSection = selection;
        var selStr = "Select your destination.#b";
        for (var i = 0; i < maps[selection].length; i++) selStr += "\r\n#L" + i + "##m" + maps[selection][i] + "#";
        cm.sendSimple(selStr);
    } else if (status == 2) {
        chosenMap = selection;
        cm.sendYesNo("Do you want to go to #m" + maps[chosenSection][selection] + "#?");
    } else if (status == 3) {
        cm.warp(maps[chosenSection][chosenMap]);
        cm.dispose();
    }
}

function jobAdv(selection) {
    if (status == 0) {
        newJob = cm.getJobId() + 1;
        if (cm.getJobId() % 10 == 2) {
            cm.sendOk("Hey, how's it going? I've been doing well here.");
            cm.dispose();
        } else if (cm.getJobId() % 10 >= 0 && cm.getJobId() % 100 != 0) {
            var secondJob = cm.getJobId() % 10 == 0;
            if ((secondJob && cm.getLevel() < 70) || (!secondJob && cm.getLevel() < 120)) {
                cm.sendOk("Hey, how's it going? I've been doing well here.");
                cm.dispose();
            } else cm.sendYesNo("Great job getting to level " + cm.getLevel() + ". Would you like to become a #b" + cm.getJobName(newJob) + "#k ?");
        } else {
            if (cm.getJobId() % 1000 == 0) {
                if (cm.getLevel() >= 10 && cm.getJobId() != 2000)
                    for (var i = 1; i < 6; i++) possibleJobs.push(cm.getJobId() + 100 * i);
                else if (cm.getLevel() >= 10 && cm.getJobId() == 2000) possibleJobs.push(cm.getJobId() + 100);
                else if (cm.getLevel() >= 8 && cm.getJobId() != 2000) possibleJobs.push(cm.getJobId() + 200);
            } else if (cm.getLevel() >= 30 && cm.getJobId() % 100 == 0) {
                switch (cm.getJobId()) {
                    case 100:
                    case 200:
                        possibleJobs.push(cm.getJobId() + 30);
                    case 300:
                    case 400:
                    case 500:
                        possibleJobs.push(cm.getJobId() + 20);
                    case 1100:
                    case 1200:
                    case 1300:
                    case 1400:
                    case 1500:
                    case 2100:
                        possibleJobs.push(cm.getJobId() + 10);
                        break;
                }
            } else if (cm.getLevel() >= 70 && cm.getJob().isSecondJob()) {
                possibleJobs.push(cm.getJobId() + 1);
            } else if (cm.getLevel() >= 120 && cm.getJob().isThirdJob()) {
                possibleJobs.push(cm.getJobId() + 1);
            }
            if (possibleJobs.length == 0) {
                cm.sendOk("Hey, how's it going? I've been doing well here.");
                cm.dispose();
            } else {
                var text = "There are the available jobs you can take#b";
                for (var j = 0; j < possibleJobs.length; j++) text += "\r\n#L" + j + "#" + cm.getJobName(possibleJobs[j]) + "#l";
                cm.sendSimple(text);
            }
        }
    } else if (status == 1 && cm.getJobId() % 100 != 0) {
        cm.changeJobById(cm.getJobId() + 1);
        cm.maxMastery();
        cm.dispose();
    } else if (status == 1) {
        cm.changeJobById(possibleJobs[selection]);
        cm.maxMastery();
        cm.dispose();
    } else if (status == 2) {
        job = selection;
        cm.sendYesNo("Are you sure you want to job advance?");
    } else if (status == 3) {
        cm.changeJobById(possibleJobs[job]);
        cm.dispose();
    }
}