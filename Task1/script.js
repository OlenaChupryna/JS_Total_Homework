"use strict";
class SimpleEquipment {
	constructor (name){
		this._name = name;
		this._OnOffState = false;
		this.switcher = Switcher;	
		this.htmlEquipment = "";
		this.htmlSwitcher = "";
		this.pattern = "";
	}
	
	changeState() {
		this._OnOffState = this.switcher.turn(this._OnOffState);		
	}
	
	createHtmlItem() {
		this.htmlEquipment = document.getElementById(this.pattern).cloneNode(true);
		this.htmlEquipment.id = this._name;
		this.htmlEquipment.style.display = "block";
		this.htmlEquipment.children[0].innerHTML = this._name;
		
		document.body.appendChild(this.htmlEquipment);
		
		this.htmlSwitcher = this.htmlEquipment.children[1].children[0];
		this.htmlSwitcher.onchange = () => {		
			this.changeState();
			this.createSwitcherHtmlEffect()
		}
	}
	
	createSwitcherHtmlEffect() {}			
}

class Lamp extends SimpleEquipment {
	constructor(name) {
		super(name);
		this.pattern = "lampPattern";
	}
	createSwitcherHtmlEffect() {
		let lampImg = this.htmlEquipment.getElementsByTagName("img")[0];
		if (this._OnOffState == true) {
				lampImg.setAttribute("src", "./images/lamp_on.jpg");				
				lampImg.setAttribute("alt", "Lamp is on");
			} else {
				lampImg.setAttribute("src", "./images/lamp_off.jpg");				
				lampImg.setAttribute("alt", "Lamp is off");			
			}
	}
}

class Chandelier extends SimpleEquipment {
	constructor (name){
		super(name);
		this.regulator = Regulator;
		this._currentVolume = 50;
		this.maxVolume = 100;
		this.minVolume = 0;
		this.step = 10;
		this.htmlRegulator = "";
		this.pattern = "chandelierPattern";		
	}
	
	setLightVolume(newVolume) {
		if (this._OnOffState == true) {
			this._currentVolume = this.regulator.setVolume(newVolume);
		} else {
			alert ("Turn me on!");
		}
	}
	createHtmlItem() {
		super.createHtmlItem();
		this.htmlRegulator = this.htmlEquipment.children[2].children[0];
		this.htmlRegulator.min = this.minVolume;
		this.htmlRegulator.max = this.maxVolume;
		this.htmlRegulator.step = this.step;
		this.htmlRegulator.value = this._currentVolume;
		this.htmlRegulator.onchange = () => {
			this.setLightVolume(this.htmlRegulator.value);
			let spanVolume = this.htmlRegulator.nextElementSibling.children[0];
			spanVolume.innerText = this._currentVolume;
		}
		document.body.appendChild(this.htmlEquipment);
	}
	
	createSwitcherHtmlEffect() {
		if (this._OnOffState == true) {
			this.htmlSwitcher.nextElementSibling.innerHTML = "light is on";
		} else {
			this.htmlSwitcher.nextElementSibling.innerHTML = "light is off";
		}
	}	
}
	
	
class Washer extends SimpleEquipment {
	constructor (name){
		super(name);
		this.pattern = "washerPattern";	
		this.programmes = [
			{
				name: "Cotton",
				temperature: "40",
				squeesingSpeed: "1000",
				washingTime: 4000,
				squeesingTime: 3000
				
			},
			{
				name: "Synthetic",
				temperature: "30",
				squeesingSpeed: "800",
				washingTime: 3000,
				squeesingTime: 2000
			}
		];		
		this.programmeName = "Cotton";
		this.programmeState = "waiting";
		this.programmeTemperature = "40";
		this.programmeSqueesingSpeed = "800";	
		this.programmeWashingTime = 4000;
		this.programmeSqueesingTime = 3000;
		this.timeLost = (this.programmeWashingTime + this.programmeSqueesingTime) / 1000;
		this.htmlTablo = "";
		this.htmlStartButton = "";
		this.htmlProgrammesList = [];
				
	}

	selectProgramme(chosenProgramme) {
		this.programmeName = chosenProgramme.name;
		this.programmeTemperature = chosenProgramme.temperature;
		this.programmeSqueesingSpeed = chosenProgramme.squeesingSpeed;
		this.programmeWashingTime = chosenProgramme.washingTime;
		this.programmeSqueesingTime = chosenProgramme.squeesingTime;	
	}
	
	autoOff() {
		this.changeState(); 
		console.log(this._OnOffState);
		this.htmlSwitcher.nextElementSibling.innerHTML = "Washer is off";
		this.htmlSwitcher.checked = false;
		this.htmlTablo.style.display = "none";
	}
	
	changeProgrammeState(newState) {
		this.programmeState = newState;
	}
		
	runProgramme(
	washingTime = this.programmeWashingTime, 
	squeesingTime = this.programmeSqueesingTime, 
	autoOffFunc = () => {return this.autoOff()},
	changeProgrammeStateFunc = (newState) => {return this.changeProgrammeState(newState)}
	) {
	    let pg = promiseGenerator(washingTime, squeesingTime, autoOffFunc, changeProgrammeStateFunc);
	    pg.next(washingTime, squeesingTime, autoOffFunc, changeProgrammeStateFunc).value.then(
			(squeesingTimeRes) => pg.next(squeesingTimeRes).value.then(
				(onOffStateRes) => pg.next(onOffStateRes)				
			)
	    );			
	}
	
	createHtmlItem() {
		super.createHtmlItem();	
		this.htmlProgrammesList = this.htmlEquipment.children[2].children[0].children[1].children[0].children;
			console.log (this.htmlProgrammesList);
			console.log (this.htmlProgrammesList[0]);
		for (let i = 0; i < this.htmlProgrammesList.length; i++) {
			this.htmlProgrammesList[i].onchange = () => {
				this.selectProgramme(this.programmes[i]);
				tabloTimerFunc();
			}
		}
		
		this.htmlStartButton = this.htmlEquipment.children[3].children[0];
		
		this.htmlStartButton.onclick = () => {
			if (this._OnOffState == true) {
				this.runProgramme();
				setInterval(tabloTimerFunc, 1000);				
			} 			
		}
		
		this.htmlTablo = washer[washerCounter].htmlEquipment.children[4];
		
		let tabloTimerFunc = () => {
		this.htmlTablo.children[0].children[0].innerHTML = this.programmeName;
		this.htmlTablo.children[1].children[0].innerHTML = this.programmeState;
		this.htmlTablo.children[2].children[0].innerHTML = this.programmeTemperature;
		this.htmlTablo.children[3].children[0].innerHTML = this.programmeSqueesingSpeed;
		this.htmlTablo.children[4].children[0].innerHTML = this.timeLost;
		} 
				
		tabloTimerFunc()
	}
	
	createSwitcherHtmlEffect() {
		if (this._OnOffState == true) {
			this.htmlSwitcher.nextElementSibling.innerHTML = "Washer is on";
			this.htmlTablo.style.display = "block";
		} else {
			this.htmlSwitcher.nextElementSibling.innerHTML = "Washer is off";
			this.htmlTablo.style.display = "none";
		}
	}	
}

class Switcher {
	static turn(state) {
		if (state == true) {
		return false;
		} else {
		return true;
		}
	}
}

class Regulator {
	static higherVolume(currentVolume, maxVolume, step) {
		if (currentVolume < maxVolume) {
		currentVolume += step;
		}
		return currentVolume;
	} 		

	static lowerVolume(currentVolume, minVolume, step) {		
		if (currentVolume > minVolume) {
		currentVolume -= step;
		}
		return currentVolume;
	}
	
	static setVolume(newVolume) {		
		return newVolume;
	}
}


let lamp = [];
let lampCounter = 0;
function createLamps (){
 	lamp[lampCounter] = new Lamp("lamp " + (lampCounter + 1), "lampPattern");
	lamp[lampCounter].createHtmlItem();
	lampCounter++;
}

let chandelier = [];
let ChandelierCounter = 0;
function createChandeliers (){
 	chandelier[ChandelierCounter] = new Chandelier("chandelier " + (ChandelierCounter + 1), "chandelierPattern");
	chandelier[ChandelierCounter].createHtmlItem();
	ChandelierCounter++;
}

let washer = [];
let washerCounter = 0;
function createWashers (){
 	washer[washerCounter] = new Washer("washer " + (washerCounter + 1));
	washer[washerCounter].createHtmlItem();
	washerCounter++;
}


function washing (washingTime, squeesingTime, autoOffFunc, changeProgrammeStateFunc) {
	return new Promise((resolve) => {
		console.log("Washing ...");
		changeProgrammeStateFunc("washing");
		setTimeout( 
			() => {
				console.log("Washing is up...");
				//soundOff();
				resolve([squeesingTime, autoOffFunc, changeProgrammeStateFunc]);
			},
			washingTime
		);
	});
}

function squeesing([squeesingTime, autoOffFunc, changeProgrammeStateFunc]) {
	return new Promise((resolve) => {
		console.log("Squeesing ...");
		changeProgrammeStateFunc("squeesing");
		setTimeout(
			() => {
				console.log("squeesing is up");
				console.log("Washing programme is finished");
				resolve([autoOffFunc, changeProgrammeStateFunc]);
			},
			squeesingTime
		);
	});
}

function autoOff([autoOffFunc, changeProgrammeStateFunc]) {
	return new Promise((resolve) => {
		console.log("Waiting for autoOff ...");
		changeProgrammeStateFunc("finished");
		setTimeout(
			() => {
				autoOffFunc();
				changeProgrammeStateFunc("waiting");
			},
			3000
		);
	});
}

function* promiseGenerator(washingTime, squeesingTime, autoOffFunc, changeProgrammeStateFunc) { 
	let squeesingTimeRes = yield washing(washingTime, squeesingTime, autoOffFunc, changeProgrammeStateFunc); 
	let onOffStateRes = yield squeesing(squeesingTimeRes); 
	yield autoOff(onOffStateRes);	
}