var e_NFA_automat; 
var NFA_automat;
var DFA_automat;
var initial_state;
var final_states = new Set();
var DFA_final_states = new Set();
var states = new Set();
var DFA_states = new Set();
var alphabet = new Set();
var NFA_alphabet = new Set();
var transitions = [];
var transitions_dictionary = new Object();
var NFA_transitinons = [];
var NFA_transitinons_dictioanry = new Object();
var DFA_transitions_dictionary = new Object();
//var tmp_transitions_dictionary = new Object();
$(document).on('click','#submit',function(){
    initial_state = $("#initial-state").val();
    alert(initial_state);
    final_state = $("#final-state").val();
    first_state = $("#first-state").val();
    transition_string = $("#transition-string").val();
    last_state = $("#last-state").val();
    completeNFA(initial_state,final_state,first_state,transition_string,last_state);
    
})
$(document).on('click','#convert-to-nfa',function(){
    debugger;
    NFA_transitinons_dictioanry = new Object();
    //createDictionaryOfTransitions(states);
    console.log(transitions_dictionary);
    var check = false;
    console.log(e_NFA_automat.transitions);
    var arr = [];
    if (!checkIfeNFAisNFA(transitions_dictionary)) {
        //findEpsilonClosure();
        var e_closure;
        var trnasitive_state_epsilon_closure;
        console.log(states);
        console.log(typeof states.values());
        console.log("Te dhenat e gjendejve jane: " + states.keys());
        for (var iterator = states.values(), val= null; val=iterator.next().value;) {
            if (transitions_dictionary[val]) {
                arr = [];
                var length_of_state_transitions = transitions_dictionary[val].length;
                console.log("Gjatesia e transitions per gjendjen" + val + " : " +length_of_state_transitions);
                e_closure = []; 
                for (let j = 0; j < length_of_state_transitions; j=j+2) { //transitions_dictionary eshte nje object shife si i merret gjatesia
                    console.log(transitions_dictionary[val]);
                    const element_array = transitions_dictionary[val][j]; //stringu i kalimit
                    console.log(element_array);
                    if(element_array == "ε"){
                        e_closure.push(transitions_dictionary[val][j+1]);
                        checkForIncomingEpsilon(val,transitions_dictionary[val][j+1],true,element_array,arr);
                    }
                    else{
                        if(!checkIfTransitionExists(val,element_array,transitions_dictionary[val][j+1])){
                            addElementTotransitionsDictionary(val,element_array,transitions_dictionary[val][j+1]);
                            console.log(NFA_transitinons_dictioanry[val]);
                        }
                        arr=[];
                        checkForIncomingEpsilon(val,transitions_dictionary[val][j+1],false,element_array,arr);
                    }
                }
            }
        }
        debugger;
        var dotGraph;
        console.log(initial_state,Array.from(final_states.values()),Array.from(states.values()),Array.from(alphabet.values()),NFA_transitinons_dictioanry);

        console.log("Initial state eshte : "+ initial_state);
        console.log("final states jane : "+ Array.from(final_states.values()));
        console.log(NFA_transitinons_dictioanry);
        var tmp = alphabet;
        tmp.delete("ε");
        console.log("Alfabeti eshte : "+ Array.from(tmp.values()));
        console.log("states total jane : "+ Array.from(states.values()));


        // NFA_automat.changeFinalStates(Array.from(final_states.values()));
        NFA_alphabet = alphabet;
        NFA_alphabet.delete("ε");
        NFA_automat = new e_NFA(initial_state,Array.from(final_states.values()),Array.from(states.values()),Array.from(tmp.values()),NFA_transitinons_dictioanry);
        dotGraph = NFA_automat.toGraphForm();
        //dotGraph =  NFA_automat.changeTransitions(NFA_transitinons_dictioanry);
        d3.select("#nfa").graphviz().zoom(false).renderDot(dotGraph);    
    }
    else{
        alert("it is already an nfa");
        console.log(initial_state,Array.from(final_states.values()),Array.from(states.values()),Array.from(alphabet.values()),NFA_transitinons_dictioanry);

        console.log("Initial state eshte : "+ initial_state);
        console.log("final states jane : "+ Array.from(final_states.values()));
        console.log(NFA_transitinons_dictioanry);
        var tmp = alphabet;
        tmp.delete("ε");
        console.log("Alfabeti eshte : "+ Array.from(tmp.values()));
        console.log("states total jane : "+ Array.from(states.values()));


        // NFA_automat.changeFinalStates(Array.from(final_states.values()));
        
        NFA_transitinons_dictioanry = transitions_dictionary;
        NFA_alphabet = e_NFA_automat.alphabet;
        NFA_automat = new e_NFA(initial_state,Array.from(final_states.values()),Array.from(states.values()),Array.from(tmp.values()),NFA_transitinons_dictioanry);
        d3.select("#nfa").graphviz().zoom(false).renderDot(NFA_automat.toGraphForm());
    }
    // for (let index = 0; index < transitions.length; index++) {
    //     const element = transitions[index];
    //     if(element[1] == "ε"){
    //         check = false;
    //         break;
    //     }
    // }
    // if(check == true){
    //     alert("Kjo eshte vete nje NFA. Diagram mbetet e njejte");
    // }
    // else{

    
    //}
})

//kemi nje set gjendjesh per DfA 
//kemi nje Object per transitionet
//kemi nje stack per te ruajtur gjendejt e reja te futura

//algoritmi:

//persakohe qe staku jo bosh, kontrollojme secilin element se ku shkon me stringet e fjalorit
//nese eshte gjendej e re e fusim tek seti i gjendjeve dhe tek transizionet dhe ne stakun e gjendjeve
//i bjeme pop gjendjes aktuale
$(document).on('click','#convert-to-dfa',function(){
    DFA_transitions_dictionary = new Object();
    DFA_final_states = new Set();
    DFA_states = new Set();
    debugger;
    var states_stack = [];
    initial_state.split(",").forEach(element => {
      states_stack.push(element);  
    });
    console.log(states_stack);
    var checkForAlphabetElements = new Object();
    
    //checkForAlphabetElements[] bej nje funksion qe ta mbushesh me vlerat e alfabetit dhe asocioi me tabela boshe
    //pas cdo perseritje asocimet beji bosh
    if (NFA_alphabet.size === 0) {
        DFA_automat = new e_NFA(initial_state,initial_state,Array.from(states.values()),Array.from(NFA_alphabet.values()),DFA_transitions_dictionary);
        dotGraph = DFA_automat.toGraphForm();
        //dotGraph =  NFA_automat.changeTransitions(NFA_transitinons_dictioanry);
        d3.select("#dfa").graphviz().zoom(false).renderDot(dotGraph); 
    }
    else{
        var states_stack = [];
        initial_state.split(",").forEach(element => {
            states_stack.push(element);  
        });
        console.log(states_stack);
        var checkForAlphabetElements = new Object();
        while(states_stack.length > 0){
            var tmp = states_stack.pop();
            state_in_control = tmp.split(",");
            //state_in_control.sort();
            if(checkIfItContainsFinalStates(final_states,state_in_control.join(""))){
                // console.log(Array.isArray(tmp));
                // tmp.join("");
                // console.log(Array.isArray(tmp));
                DFA_final_states.add(state_in_control.join(""));
            }
            DFA_states.add(state_in_control.join(""));

            //kontrolloje nqs eshte array
            checkForAlphabetElements = new Object();
            fillAlphabetTransitionObject(checkForAlphabetElements);
            if (Array.isArray(state_in_control) && state_in_control.length > 1) {
                for (let i = 0; i < state_in_control.length; i++) {
                    var element = state_in_control[i];
                    if (NFA_transitinons_dictioanry[element]) {
                        for (let j = 0; j < NFA_transitinons_dictioanry[element].length; j=j+2) {
                            console.log(NFA_transitinons_dictioanry[element][j]);
                            console.log(NFA_transitinons_dictioanry[element][j+1]);
                            console.log(NFA_transitinons_dictioanry[element]);
                            if(!checkForAlphabetElements[NFA_transitinons_dictioanry[element][j]].includes(NFA_transitinons_dictioanry[element][j+1])){
                                checkForAlphabetElements[NFA_transitinons_dictioanry[element][j]].push(NFA_transitinons_dictioanry[element][j+1]);
                            }
                        }
                    }
                }
                var stateInStringForm = state_in_control.sort().join("");
                for (var iterator = NFA_alphabet.values(), val= null; val=iterator.next().value;) {
                    if (checkForAlphabetElements[val].length != 0 ) {
                        var tmp = checkForAlphabetElements[val];
                        tmp.sort();
                        // if(checkIfItContainsFinalStates(final_states,tmp)){
                        //     console.log(Array.isArray(tmp));
                        //     tmp.join("");
                        //     console.log(Array.isArray(tmp));
                        //     DFA_final_states.add(checkForAlphabetElements[val].join(""));
                        // }
                        console.log(Array.isArray(tmp));
                        console.log(tmp);
                        console.log(checkForAlphabetElements[val].join(""));
                        // DFA_states.add(tmp);
                        addElementToDFAtransitionsDictionary(stateInStringForm,val,checkForAlphabetElements[val].sort().join(""));
                        console.log(checkForAlphabetElements[val]);
                        addToStatesStack(states_stack,checkForAlphabetElements[val].sort());
                    }
                    else{
                        alert("Error state needed");
                        DFA_states.add("Error");
                        addElementToDFAtransitionsDictionary(stateInStringForm,val,"Error");
                    }
                }
            }
            else if(NFA_transitinons_dictioanry[state_in_control[0]]){
                console.log(state_in_control[0]);
                for (let index = 0; index < NFA_transitinons_dictioanry[state_in_control[0]].length; index=index+2) {
                    console.log(NFA_transitinons_dictioanry[state_in_control[0]][index]);
                    console.log(NFA_transitinons_dictioanry[state_in_control[0]][index+1]);
                    if(!checkForAlphabetElements[NFA_transitinons_dictioanry[state_in_control[0]][index]].includes(NFA_transitinons_dictioanry[state_in_control[0]][index+1])){
                        checkForAlphabetElements[NFA_transitinons_dictioanry[state_in_control[0]][index]].push(NFA_transitinons_dictioanry[state_in_control[0]][index+1]);
                    }
                }
                for (var iterator = NFA_alphabet.values(), val= null; val=iterator.next().value;) {
                    if (checkForAlphabetElements[val].length != 0 ) {
                        var tmp = checkForAlphabetElements[val].sort();
                        // if(checkIfItContainsFinalStates(final_states,tmp)){
                        //     console.log(Array.isArray(tmp));
                        //     tmp.join("");
                        //     console.log(Array.isArray(tmp));
                        //     console.log(checkForAlphabetElements[val].join(""));
                        //     DFA_final_states.add(checkForAlphabetElements[val].join(""));
                        // }
                        console.log(Array.isArray(tmp));
                        tmp.join("");
                        console.log(Array.isArray(tmp));
                        console.log(checkForAlphabetElements[val].join(""));
                        // DFA_states.add(checkForAlphabetElements[val].join(""));
                        console.log(checkForAlphabetElements[val].sort());
                        addElementToDFAtransitionsDictionary(state_in_control[0],val,checkForAlphabetElements[val].sort().join(""));
                        addToStatesStack(states_stack,checkForAlphabetElements[val].sort());
                    }
                    else{
                        alert("Error state needed");
                        DFA_states.add("Error");
                        addElementToDFAtransitionsDictionary(state_in_control[0],val,"Error");
                    }
                }
            }
            else{
                for (var iterator = NFA_alphabet.values(), val= null; val=iterator.next().value;) {
                    addElementToDFAtransitionsDictionary(state_in_control[0],val,"Error");
                }
                DFA_states.add("Error");
            }
        } 
    
    if (DFA_states.has("Error")) {
        for (var iterator = NFA_alphabet.values(), val= null; val=iterator.next().value;) {
            addElementToDFAtransitionsDictionary("Error",val,"Error");
        }
    }
    //rasti kur alfabeti eshte bosh pra nuk ka kalime DFA eshte thjesht gjendja fillestare e cila behet fundore
    //per cdo element alfabeti nqs eshte gjendja error coje ne vetvete
    DFA_automat = new e_NFA(initial_state,Array.from(DFA_final_states.values()),Array.from(DFA_states.values()),Array.from(NFA_alphabet.values()),DFA_transitions_dictionary);
    dotGraph = DFA_automat.toGraphForm();
    //dotGraph =  NFA_automat.changeTransitions(NFA_transitinons_dictioanry);
    d3.select("#dfa").graphviz().zoom(false).renderDot(dotGraph);   
} 

            
            //per cdo element alfabeti kontrolloi ku shkojne dhe futi tek objekti checkForAlphabetElements
            
            //......

            //ne fund bejme tranzicionet per gjnedjet e perftuara dhe i fusim tek tranzicionet e dfa
            //nese gjendjet e reja transitive nuk ekzistojne ne states of DFA e fusim aty dhe ne stak

        
        //kontrolloje 

    //     var state_in_control = states_stack.pop();
    //     if (Array.isArray(state_in_control)) {
    //         var new_state = [];
    //         for (let i = 0; i < state_in_control.length; i++) {
    //             const element = state_in_control[i];
    //             for (var iterator = alphabet.values(), val= null; val=iterator.next().value;) {
    //                 if(DFA_transitions_dictionary[element] && DFA_transitions_dictionary[element].includes(val)){
    //                     var tmp = findTransitiveStateForGivenString(val,DFA_transitions_dictionary[element]);
    //                     if(tmp!= null){
    //                         addExistingElementsToNewState(new_state,tmp);
    //                     }
    //                 }
    //                 else if (NFA_transitinons_dictioanry[element]) {
    //                     for (let i = 0; i < NFA_transitinons_dictioanry[element].length; i=i+2) {
    //                         const second_element = NFA_transitinons_dictioanry[element][i];
    //                         if(second_element == val){
    //                             if (!new_state.includes(NFA_transitinons_dictioanry[element][i+1])) {
    //                                 new_state.push(NFA_transitinons_dictioanry[element][i+1]);
    //                             }
    //                             console.log(new_state);
    //                         }
    //                     }
    //                 }
    //                 states_stack.push(new_state);
    //                 console.log(Array.isArray(new_state));
    //                 console.log(Array.isArray("q0"));
    //             }
    //             if(!states_stack.includes(new_state)){
                    
            
    //                 addElementToDFAtransitionsDictionary(state_in_control,val,new_state);
    //                 tmp = new_state.join("");
    //                 DFA_states.add(tmp);
    //             }
    //         }
    //     }
    //     else if(NFA_transitinons_dictioanry[state_in_control]){
    //         var new_state = [];
    //         var tmp = "";
    //         for (var iterator = alphabet.values(), val= null; val=iterator.next().value;) {
    //             if (NFA_transitinons_dictioanry[state_in_control]) {
    //                 for (let i = 0; i < NFA_transitinons_dictioanry[state_in_control].length; i=i+2) {
    //                     const element = NFA_transitinons_dictioanry[state_in_control][i];
    //                     if(element == val){
    //                         new_state.push(NFA_transitinons_dictioanry[state_in_control][i+1]);
    //                         console.log(new_state);
    //                     }
    //                 }
    //                 if(!states_stack.includes(new_state)){
    //                     states_stack.push(new_state);
    //                     console.log(Array.isArray(new_state));
    //                     console.log(Array.isArray("q0"));
    //                     addElementToDFAtransitionsDictionary(state_in_control,val,new_state);
    //                     tmp = new_state.join("");
    //                     DFA_states.add(tmp);
    //                 }
                    
    //             }
    //         }
    //     }
    // }

})
function fillAlphabetTransitionObject(obj){
    debugger;
    for (var iterator = NFA_alphabet.values(), val= null; val=iterator.next().value;) {
        obj[val] = [];
    }
}
function addToStatesStack(states_stack,state){
    debugger;
    if(Array.isArray(state)){
        if(!states_stack.includes(state.join(",")) && !DFA_states.has(state.join(""))){
            states_stack.push(state.join(","));
        }
    }
    else if(!states_stack.includes(state) && !DFA_states.has(state)){
        states_stack.push(state);
    }
}
function checkIfItContainsFinalStates(finalStates,state_in_consideration){
    debugger;
    for (var iterator = final_states.values(), val= null; val=iterator.next().value;) {
        if (state_in_consideration.includes(val)) {
            return true;
        }
    }
    return false;
}
function findTransitiveStateForGivenString(string,arr){
    debugger;
    for (let i = 0; i < arr.length; i=i+2) {
        const element = arr[i];
        if (arr[i] == string) {
            return arr[i+1];
        }
    }
    return null;
}
function addExistingElementsToNewState(states,newStates){
    debugger;
    for (let i = 0; i < newStates.length; i++) {
        const element = newStates[i];
        states.push(element);
    }
}
function checkForIncomingEpsilon(first_state,transitive_state,check,string_kalimi,last_split_state){
    debugger;
    if (check) {
        console.log(last_split_state);
        //dy raste
        //1. Na vijne vetem e derisa arrijme ne nje cikel
        //2. Na vijne vetem e pasi na ka ardhur nje element i ndryshem
        //kujdes kemi rastin kur elementi shkon ne vetvete me =>e ->w 
        //ndryhso kushtin
        if (first_state != transitive_state && !last_split_state.includes(transitive_state)) {
            if (transitions_dictionary[transitive_state]) {
                var length_of_state_transitions = transitions_dictionary[transitive_state].length;
                console.log("Gjatesia e transitions per gjendjen" + transitive_state + " : " +length_of_state_transitions);
                e_closure = []; 
                for (let j = 0; j < length_of_state_transitions; j=j+2) { //transitions_dictionary eshte nje object shife si i merret gjatesia
                    console.log(transitions_dictionary[transitive_state]);
                    const element_array = transitions_dictionary[transitive_state][j];
                    console.log(element_array);
                    if(element_array == "ε"){
                        last_split_state.push(transitive_state);
                        console.log(last_split_state);
                        checkForIncomingEpsilon(first_state,transitions_dictionary[transitive_state][j+1],true,string_kalimi,last_split_state);
                    }
                     else{
                    //     if (first_state == transitions_dictionary[transitive_state][j+1] && number_of_cycles_of_first_state == 0) {
                            if(!checkIfTransitionExists(first_state,element_array,transitions_dictionary[transitive_state][j+1])){
                                addElementTotransitionsDictionary(first_state,element_array,transitions_dictionary[transitive_state][j+1]);
                                console.log(NFA_transitinons_dictioanry[first_state]);
                            }
                            var arr = []
                            checkForIncomingEpsilon(first_state,transitions_dictionary[transitive_state][j+1],false,element_array,arr);
                    //     }
                        // else if(number_of_cycles_of_first_state == 0){
                        //     checkForIncomingEpsilon(first_state,element_array,transitions_dictionary[transitive_state][j+1],number_of_cycles_of_first_state/
                        //         number_of_cycles_of_split_state,[]);
                        // }
                    }
                }
            }
        }
    }
    else{
        if (!last_split_state.includes(transitive_state)) {
            //last_split_state = [];
            // last_split_state.push(transitive_state);
            console.log(last_split_state);
            continueChecking(first_state,transitive_state,check,string_kalimi,last_split_state);
        }
        // else if(!last_split_state.contains(transitive_state)){
        //     last_split_state.push(transitive_state);
        //     console.log(last_split_state);
        //     continueChecking(first_state,transitive_state,check,string_kalimi,last_split_state);
        // }
        // if (first_state == transitive_state && number_of_cycles == 0) {
        //     continueChecking(first_state,transitive_state,check,string_kalimi,number_of_cycles_of_first_state++,number_of_cycles_of_split_state,last_split_state);
        // }
        // else if(transitive_state == last_split_state && number_of_cycles_of_split_state == 0){
        //     continueChecking(first_state,transitive_state,check,string_kalimi,number_of_cycles_of_first_state,number_of_cycles_of_split_state++,last_split_state);
        // }
        // else{
        //     continueChecking(first_state,transitive_state,check,string_kalimi,number_of_cycles_of_first_state,number_of_cycles_of_split_state,last_split_state);
        // }
            // if (transitions_dictionary[transitive_state]) {
            //     var length_of_state_transitions = transitions_dictionary[transitive_state].length;
            //     console.log("Gjatesia e transitions per gjendjen" + transitive_state + " : " +length_of_state_transitions);
            //     e_closure = []; 
            //     for (let j = 0; j < length_of_state_transitions; j=j+2) {
            //         if(transitions_dictionary[transitive_state][j] == "ε"){
            //             if(!checkIfTransitionExists(first_state,string_kalimi,transitions_dictionary[transitive_state][j+1])){
            //                 addElementTotransitionsDictionary(first_state,string_kalimi,transitions_dictionary[transitive_state][j+1]);
            //                 console.log(NFA_transitinons_dictioanry[first_state]);
            //             }
            //             checkForIncomingEpsilon(first_state,transitions_dictionary[transitive_state][j+1],false,string_kalimi);
            //         }
            //     }
            // }      
    }
}
function continueChecking(first_state,transitive_state,check,string_kalimi,last_split_state){
    debugger;
    if (!last_split_state.includes(transitive_state)) {
        if (transitions_dictionary[transitive_state]) {
            var length_of_state_transitions = transitions_dictionary[transitive_state].length;
            console.log("Gjatesia e transitions per gjendjen" + transitive_state + " : " +length_of_state_transitions);
            e_closure = []; 
            for (let j = 0; j < length_of_state_transitions; j=j+2) {
                if(transitions_dictionary[transitive_state][j] == "ε"){
                    if(!checkIfTransitionExists(first_state,string_kalimi,transitions_dictionary[transitive_state][j+1])){
                        addElementTotransitionsDictionary(first_state,string_kalimi,transitions_dictionary[transitive_state][j+1]);
                        console.log(NFA_transitinons_dictioanry[first_state]);
                    }
                    last_split_state.push(transitive_state);
                    checkForIncomingEpsilon(first_state,transitions_dictionary[transitive_state][j+1],false,string_kalimi,last_split_state);
                }
            }
            // last_split_state.push(transitive_state);
        }    
    }
    //return last_split_state;
}
function checkIfeNFAisNFA(transitions){
    debugger;
    for (var iterator = states.values(), val= null; val=iterator.next().value;) {
        if ( transitions_dictionary[val]) {
            var length_of_state_transitions = transitions_dictionary[val].length;
            console.log("Gjatesia e transitions per gjendjen" + val + " : " +length_of_state_transitions);
            for (let j = 0; j < length_of_state_transitions; j=j+2) { //transitions_dictionary eshte nje object shife si i merret gjatesia
                console.log(transitions[val]);
                const element_array = transitions[val][j];
                console.log(element_array);
                if (element_array == "ε") {
                    return false;
                }
            }
        }
    }
    return true;
}
function findEpsilonClosure(){
    // alert(window.initial_state);
    // alert(final_states);
    // alert(alphabet);
    var e_closure;
    var trnasitive_state_epsilon_closure;
    console.log(states);
    console.log(typeof states.values());
    console.log("Te dhenat e gjendejve jane: " + states.keys());
    for (var iterator = states.values(), val= null; val=iterator.next().value;) {
        if ( transitions_dictionary[val]) {
            var length_of_state_transitions = transitions_dictionary[val].length;
            console.log("Gjatesia e transitions per gjendjen" + val + " : " +length_of_state_transitions);
            e_closure = []; 
            for (let j = 0; j < length_of_state_transitions/2; j=j+2) { //transitions_dictionary eshte nje object shife si i merret gjatesia
                console.log(transitions_dictionary[val]);
                const element_array = transitions_dictionary[val][j];
                console.log(element_array);
                if(element_array == "ε"){
                    e_closure.push(transitions_dictionary[val][j+1]);
                }
                else{
                    console.log(val,transitions_dictionary[val][j],transitions_dictionary[val][j+1]);
                    //addElementToTransitions(val,transitions_dictionary[val][j],transitions_dictionary[val][j+1]);
                    if (checkIfTransitionExists(val,transitions_dictionary[val][j],transitions_dictionary[val][j+1])) {
                        addElementTotransitionsDictionary(val,transitions_dictionary[val][j],transitions_dictionary[val][j+1]);
                        checkForSecondIncomingEpsilon(val,transitions_dictionary[val][j],transitions_dictionary[val][j+1]);
                        var tmp = [val,transitions_dictionary[val][j],transitions_dictionary[val][j+1]];
                    }
                }
            }
            for (let k = 0; k < e_closure.length; k++) {
                //debugger;
                trnasitive_state_epsilon_closure = [];
                const epsilon_transition_element = e_closure[k];
                for (var second_iterator = alphabet.values(), alphabet_iterator= null; alphabet_iterator=second_iterator.next().value;){
                    if (alphabet_iterator) {
                        console.log(transitions_dictionary[epsilon_transition_element]);
                        //console.log(transitions_dictionary[epsilon_transition_element].indexOf(alphabet_iterator));
                        if(transitions_dictionary[epsilon_transition_element]){
                            var index = transitions_dictionary[epsilon_transition_element].indexOf(alphabet_iterator);
                            if (index != -1 && index % 2 == 0 && alphabet_iterator != "ε") {
                                console.log(val,alphabet_iterator,transitions_dictionary[epsilon_transition_element][index+1]);
                                //addElementToTransitions(val,alphabet_iterator,transitions_dictionary[epsilon_transition_element][index+1]);
                                if(checkIfTransitionExists(val,alphabet_iterator,transitions_dictionary[epsilon_transition_element][index+1])){
                                    addElementTotransitionsDictionary(val,alphabet_iterator,transitions_dictionary[epsilon_transition_element][index+1]);
                                    var tmo = transitions_dictionary[epsilon_transition_element][index+1];
                                    console.log("elementi eshte: " + tmo);
                                    var element_transitions = transitions_dictionary[tmo];
                                    console.log(element_transitions);
                                    if (transitions_dictionary[tmo]) {
                                        checkForSecondIncomingEpsilon(val,transitions_dictionary[epsilon_transition_element][index+1],alphabet_iterator);
                                    }
                                }
                            }
                        } 
                    }
                }
            }
        } 
    }

    //debugger;
    var dotGraph;
    console.log(initial_state,Array.from(final_states.values()),Array.from(states.values()),Array.from(alphabet.values()),NFA_transitinons_dictioanry);
    if (NFA_automat == null) {
        NFA_automat = new e_NFA($("#initial-state").val(),Array.from(final_states.values()),Array.from(states.values()),Array.from(alphabet.values()),NFA_transitinons_dictioanry);
        dotGraph = NFA_automat.toGraphForm();
    }
    dotGraph =  NFA_automat.changeTransitions(NFA_transitinons_dictioanry);
    d3.select("#nfa").graphviz().zoom(false).renderDot(dotGraph);

}
function checkForSecondIncomingEpsilon(element,alphabet_string,transitive_element){
    // debugger;
    if (element != transitive_element) {
        if(transitions_dictionary[transitive_element]){
            for (let i = 0; i < transitions_dictionary[transitive_element].length; i=i+2) {
                if (transitions_dictionary[transitive_element][i] == "ε") {
                    console.log(element,alphabet_string,transitions_dictionary[transitive_element][i+1]);
                    if (checkIfTransitionExists(element,alphabet_string,transitions_dictionary[transitive_element][i+1])) {
                        addElementTotransitionsDictionary(element,alphabet_string,transitions_dictionary[transitive_element][i+1]); 
                        var tmp_array = [element,alphabet_string,transitions_dictionary[transitive_element][i+1]];
                        checkForSecondIncomingEpsilon(element,transitions_dictionary[transitive_element][i+1],alphabet_string);
                    }
                }
            }
        }
    }
}
// function removeEpsilonTrnasitions(first_state,e_states){
//     for (let i = 0; i < e_states.size; i++) {
//         const element = e_states[i];
//         transitions[first_state].pop(["ε",element]);
//     }
// }
// function checkForSecondComingEpsilon(element,alphabet_element,state){
//     debugger;
//     let gjatesia = transitions_dictionary[state];
//     for (let i = 0; i < gjatesia.length/2; i=i+2) {
//         const temp = transitions_dictionary[state][i];
//         if(temp == "ε"){
//             var new_state_found = transitions_dictionary[state][i+1];
//             transitions.push(element,alphabet_element,new_state_found);
//             checkForSecondComingEpsilon(element,alphabet_element,new_state_found);
//         }
//     }
// }
function checkIfTransitionExists(value,string,second_value){
    // debugger;
    if (NFA_transitinons_dictioanry[value]) {
        console.log(NFA_transitinons_dictioanry[value]);
        var gjatesia = NFA_transitinons_dictioanry[value];
        for (let i = 0; i < gjatesia.length; i=i+2) {
            if (NFA_transitinons_dictioanry[value][i] == string &&
                NFA_transitinons_dictioanry[value][i+1] == second_value ) {
                return true;
            }
        }   
    }
    return false;
}
function addElementTotransitionsDictionary(val,string,second_value){
    // debugger;
    // var gjendjet = []; 
    // gjendjet.push(string);
    // gjendjet.push(second_value);
    // tmp.push(element[1]);
    // tmp.push(element[2]);
    // //tmp.push(gjendjet);
    if (NFA_transitinons_dictioanry[val] == null) {
        var gjendjet = []; 
        gjendjet.push(string);
        gjendjet.push(second_value);
        NFA_transitinons_dictioanry[val] = gjendjet;
    }
    else{
        NFA_transitinons_dictioanry[val].push(string);
        NFA_transitinons_dictioanry[val].push(second_value);
    }
    console.log(NFA_transitinons_dictioanry);
}
function addElementToDFAtransitionsDictionary(val,string,second_value){
    debugger;
    var tmp;
    if (Array.isArray(val)) {
        tmp = val.join("");
    }
    else{
        tmp = val;
    }
    // var gjendjet = []; 
    // gjendjet.push(string);
    // gjendjet.push(second_value);
    // // tmp.push(element[1]);
    // tmp.push(element[2]);
    // //tmp.push(gjendjet);
    if (DFA_transitions_dictionary[tmp] == null) {
        var gjendjet = []; 
        gjendjet.push(string);
        gjendjet.push(second_value);
    // tmp.push(element[1]);
        DFA_transitions_dictionary[tmp] = gjendjet;
    }
    else{
        check = true;
        for (let i = 0; i < DFA_transitions_dictionary[tmp].length;i=i+2) {
            if (DFA_transitions_dictionary[tmp][i] == string &&
                DFA_transitions_dictionary[tmp][i+1] == second_value) {
                    
                alert("Transition already exists");
                check = false;
            }
        }
        if (check == true) {
            DFA_transitions_dictionary[tmp].push(string);
            DFA_transitions_dictionary[tmp].push(second_value);
        }   
    }
    console.log(DFA_transitions_dictionary);
}
function addElementToTransitions(val,string,second_value){
    var gjendjet = [val,string,second_value]; 
    NFA_transitinons.push(gjendjet);
    console.log(NFA_transitinons);
}
function createDictionaryOfTransitions(val,string,second_value){
    // debugger;
    if (transitions_dictionary == null) {
        var gjendjet = []; 
        gjendjet.push(string);
        gjendjet.push(second_value);
        transitions_dictionary[val] = gjendjet;
        console.log(transitions_dictionary);
    }
    else{
        // var gjendjet = []; 
        // gjendjet.push(string);
        // gjendjet.push(second_value);
        // tmp.push(element[1]);
        // tmp.push(element[2]);
        // //tmp.push(gjendjet);
        if (transitions_dictionary[val] == null) {
            var gjendjet = []; 
            gjendjet.push(string);
            gjendjet.push(second_value);
            transitions_dictionary[val] = gjendjet;
        }
        else{
            transitions_dictionary[val].push(string);
            transitions_dictionary[val].push(second_value);
        }
        console.log(transitions_dictionary);
    }

}
function completeNFA(initial_state,final_state,first_state,transition_string,last_state){
    if (initial_state && final_state && first_state && transition_string && last_state) {
        alert( initial_state + final_state + first_state + transition_string + last_state);
        var check = true;
        for (let index = 0; index < transitions.length; index++) {
            const element = transitions[index];
            if(element[0] == first_state &&
                element[2] == last_state &&
                element[1] == transition_string){
                    check = false;
                    alert("Kalimi nuk mund te realizohet pasi ekziston nje i tille ne automat");
                    break;
                }
        }
        if(check == true){
            var kalim = [first_state,transition_string,last_state];
            transitions.push(kalim);
            createDictionaryOfTransitions(first_state,transition_string,last_state);
        }
        //debugger;
        alphabet.add(transition_string);
        alert(states);
        if(e_NFA_automat == null){
            states.add(initial_state);
            var temp = final_state.split(",");
            for (let index = 0; index < temp.length; index++) {
                const element = temp[index];
                states.add(element);
                final_states.add(element);
            } 
            states.add(first_state).add(last_state);
            //alert(transitions);
            //alert(transitions_dictionary.values());
            // e_NFA_automat = new e_NFA(initial_state,Array.from(final_states.values()),Array.from(states.values()),Array.from(alphabet.values()),transitions);
            e_NFA_automat = new e_NFA(initial_state,Array.from(final_states.values()),Array.from(states.values()),Array.from(alphabet.values()),transitions_dictionary);
        }
        else{
            var temp = final_state.split(",");
            for (let index = 0; index < temp.length; index++) {
                const element = temp[index];
                states.add(element);
                final_states.add(element);
            }
            states.add(first_state).add(last_state); 
            console.log(Array.from(final_states.values()));
            e_NFA_automat = new e_NFA(initial_state,Array.from(final_states.values()),Array.from(states.values()),Array.from(alphabet.values()),transitions_dictionary);
            //e_NFA_automat.changeFinalStates(Array.from(final_states.values()));
        }
        var dotGraph = e_NFA_automat.toGraphForm();
        d3.select("#current-nfa").graphviz().zoom(false).renderDot(dotGraph);
    }
}
// $(document).ready(function(){

// })
