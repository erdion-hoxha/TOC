var e_NFA_automat; 
var NFA_automat;
var initial_state;
var final_states = new Set();
var states = new Set();
var alphabet = new Set();
var transitions = [];
var transitions_dictionary = new Object();
var NFA_transitinons = [];
var NFA_transitinons_dictioanry = new Object();
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
        NFA_automat = new e_NFA(initial_state,Array.from(final_states.values()),Array.from(states.values()),Array.from(tmp.values()),NFA_transitinons_dictioanry);
        dotGraph = NFA_automat.toGraphForm();
        //dotGraph =  NFA_automat.changeTransitions(NFA_transitinons_dictioanry);
        d3.select("#nfa").graphviz().zoom(false).renderDot(dotGraph);    
    }
    else{
        alert("it is already an nfa");
        d3.select("#nfa").graphviz().zoom(false).renderDot(e_NFA_automat.toGraphForm());
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
    // debugger;
    for (var iterator = states.values(), val= null; val=iterator.next().value;) {
        if ( transitions[val]) {
            var length_of_state_transitions = transitions[val].length;
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
    var gjendjet = []; 
    gjendjet.push(string);
    gjendjet.push(second_value);
    // tmp.push(element[1]);
    // tmp.push(element[2]);
    // //tmp.push(gjendjet);
    if (NFA_transitinons_dictioanry[val] == null) {
        NFA_transitinons_dictioanry[val] = gjendjet;
    }
    else{
        NFA_transitinons_dictioanry[val].push(string);
        NFA_transitinons_dictioanry[val].push(second_value);
    }
    console.log(NFA_transitinons_dictioanry);
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
        var gjendjet = []; 
        gjendjet.push(string);
        gjendjet.push(second_value);
        // tmp.push(element[1]);
        // tmp.push(element[2]);
        // //tmp.push(gjendjet);
        if (transitions_dictionary[val] == null) {
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
