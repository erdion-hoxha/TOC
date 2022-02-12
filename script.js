var e_NFA_automat; 
var NFA_automat;
var DFA_automat;
var initial_state;
var final_states = new Set();
var NFA_final_states = new Set();
var DFA_final_states = new Set();
var states = new Set();
var DFA_states = new Set();
var alphabet = new Set();
var NFA_alphabet = new Set();
//var transitions = [];
var transitions_dictionary = new Object();
//var NFA_transitinons = [];
var NFA_transitinons_dictioanry = new Object();
var DFA_transitions_dictionary = new Object();
var minimized_DFA_states = new Set();
var minimized_DFA_final_states = new Set();
var minimized_DFA_transitions_dictionary = new Object();
var minimized_DFA_initial_state;

$(document).on('click','#submit',function(){
    initial_state = $("#initial-state").val();
    //alert(initial_state);
    final_state = $("#final-state").val();
    first_state = $("#first-state").val();
    transition_string = $("#transition-string").val();
    last_state = $("#last-state").val();
    completeNFA(initial_state,final_state,first_state,transition_string,last_state);
    
})

$(document).on('click','#convert-to-nfa',function(){
    debugger;
    NFA_final_states = new Set(final_states);
    NFA_transitinons_dictioanry = new Object();
    console.log(transitions_dictionary);
    var check = false;
    console.log(e_NFA_automat.transitions);
    var arr = [];
    if (alphabet.has("ε")) {
        //findEpsilonClosure();
        //var e_closure;
        //var trnasitive_state_epsilon_closure;
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
                        //e_closure.push(transitions_dictionary[val][j+1]);
                        if (NFA_final_states.has(transitions_dictionary[val][j+1])){
                            NFA_final_states.add(val);
                        }

                        if (NFA_transitinons_dictioanry[transitions_dictionary[val][j+1] && transitions_dictionary[val][j+1] != val]) {
                            completeTransitionsWithExistingOnes(val,transitions_dictionary[val][j+1]);
                        }
                        else{
                            arr = [];
                            checkForIncomingEpsilon(val,transitions_dictionary[val][j+1],true,element_array,arr,arr);
                        }
                    }
                    else{
                        if(!checkIfTransitionExists(val,element_array,transitions_dictionary[val][j+1])){
                            addElementTotransitionsDictionary(val,element_array,transitions_dictionary[val][j+1]);
                            console.log(NFA_transitinons_dictioanry[val]);
                        }
                        arr=[];
                        checkForIncomingEpsilon(val,transitions_dictionary[val][j+1],false,element_array,arr,arr);
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

        NFA_alphabet = new Set(alphabet);
        NFA_alphabet.delete("ε");
        
        NFA_automat = new e_NFA(initial_state,Array.from(NFA_final_states.values()),Array.from(states.values()),Array.from(NFA_alphabet.values()),NFA_transitinons_dictioanry);
        dotGraph = NFA_automat.toGraphForm();
        d3.select("#nfa").graphviz().zoom(false).renderDot(dotGraph);    
    }
    else{
        $("#NFA-warn").show();
        console.log(initial_state,Array.from(NFA_final_states.values()),Array.from(states.values()),Array.from(alphabet.values()),NFA_transitinons_dictioanry);

        console.log("Initial state eshte : "+ initial_state);
        console.log("final states jane : "+ Array.from(final_states.values()));
        console.log(NFA_transitinons_dictioanry);
        
        NFA_transitinons_dictioanry = transitions_dictionary;
        NFA_alphabet = new Set(alphabet);
        NFA_alphabet.delete("ε");
        NFA_automat = new e_NFA(initial_state,Array.from(NFA_final_states.values()),Array.from(states.values()),Array.from(NFA_alphabet.values()),NFA_transitinons_dictioanry);
        d3.select("#nfa").graphviz().zoom(false).renderDot(NFA_automat.toGraphForm());
    }
    $("#illegal-input").hide(); 
    $("#convert-to-nfa").hide(); 
    $("#convert-to-dfa").show();
    $("#minimize-dfa").hide();
    $("#error").hide();
})

//kemi nje set gjendjesh per DfA 
//kemi nje Object per transitionet
//kemi nje stack per te ruajtur gjendejt e reja te futura

//algoritmi:

//persakohe qe staku jo bosh, kontrollojme secilin element se ku shkon me stringet e fjalorit
//nese eshte gjendje e re e fusim tek seti i gjendjeve dhe tek transizionet dhe ne stakun e gjendjeve
//i bjeme pop gjendjes aktuale
$(document).on('click','#convert-to-dfa',function(){
    debugger;
    $("#NFA-warn").hide(); 
    $("#illegal-input").hide(); 
    $("#convert-to-nfa").hide(); 
    $("#convert-to-dfa").hide();
    $("#minimize-dfa").show();
    $("#error").hide(); 

    DFA_transitions_dictionary = new Object();
    DFA_final_states = new Set();
    DFA_states = new Set();
    var checkForAlphabetElements = new Object();
    var checkNumberOfIsolatedInitialStates = true;
    
    //checkForAlphabetElements[] bej nje funksion qe ta mbushesh me vlerat e alfabetit dhe asocioi me tabela boshe
    //pas cdo perseritje asocimet beji bosh
    if (NFA_alphabet.size === 0) {
        var tmp = [];
        if(NFA_final_states.has(initial_state)){
            tmp.push(initial_state);
        }
        DFA_automat = new e_NFA(initial_state,tmp,Array.from(states.values()),Array.from(NFA_alphabet.values()),DFA_transitions_dictionary);
        dotGraph = DFA_automat.toGraphForm();
        d3.select("#dfa").graphviz().zoom(false).renderDot(dotGraph); 
    }
    else if(!NFA_transitinons_dictioanry[initial_state]){
        DFA_states.add(initial_state);
        DFA_states.add("Error");
        for (var iterator = NFA_alphabet.values(), val= null; val=iterator.next().value;) {
            addElementToDFAtransitionsDictionary(initial_state,val,"Error");
            addElementToDFAtransitionsDictionary("Error",val,"Error");
        }
        if (NFA_final_states.has(initial_state)) {
            DFA_final_states.add(initial_state);
        }
        
        DFA_automat = new e_NFA(initial_state,Array.from(DFA_final_states.values()),Array.from(DFA_states.values()),Array.from(NFA_alphabet.values()),DFA_transitions_dictionary);
        dotGraph = DFA_automat.toGraphForm();
        d3.select("#dfa").graphviz().zoom(false).renderDot(dotGraph); 
    }
    else{
        var states_stack = [];
        // initial_state.split(",").forEach(element => {
        states_stack.push(initial_state);  
        // });
        console.log(states_stack);
        var checkForAlphabetElements = new Object();
        while(states_stack.length > 0){
            var tmp = states_stack.pop();
            state_in_control = tmp.split(",");
            if(checkIfItContainsFinalStates(NFA_final_states,state_in_control.join(""))){
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
                        console.log(Array.isArray(tmp));
                        console.log(tmp);
                        console.log(checkForAlphabetElements[val].join(""));
                        addElementToDFAtransitionsDictionary(stateInStringForm,val,checkForAlphabetElements[val].sort().join(""));
                        console.log(checkForAlphabetElements[val]);
                        addToStatesStack(states_stack,checkForAlphabetElements[val].sort());
                    }
                    else{
                        //alert("Error state needed");
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
                        console.log(Array.isArray(tmp));
                        tmp.join("");
                        console.log(Array.isArray(tmp));
                        console.log(checkForAlphabetElements[val].join(""));
                        console.log(checkForAlphabetElements[val].sort());
                        addElementToDFAtransitionsDictionary(state_in_control[0],val,checkForAlphabetElements[val].sort().join(""));
                        addToStatesStack(states_stack,checkForAlphabetElements[val].sort());
                    }
                    else{
                        //alert("Error state needed");
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
        d3.select("#dfa").graphviz().zoom(false).renderDot(dotGraph);   
    } 
})
$(document).on('click','#minimize-dfa',function(){
    debugger;
    minimized_DFA_transitions_dictionary = new Object();
    minimized_DFA_states = new Set(DFA_states);
    minimized_DFA_final_states = new Set(DFA_automat.final_state);
    minimized_DFA_initial_state = initial_state;
    var markedPairOfStates = new Object();
    var unmarkedPairOfStates = new Object();  
    //mbushim te dy vektoret dhe bejme cikle derisa mos te kemi me markime 
    //kombinojme umarked states , kemi 3 mundesi 
    //kujtojme qe cdo gjendje eshte nje cift prej dy gjendjesh
    // 1. gjendja nuk ka ndonje gjendje te perbashket me gjendjet e tjera , e fusim direkte si nje te vetme
    //2. gjendja ka nje gjendje te perbashket me gjendjet e tjera , kombinojme 2 gjendejt e ndryshme dhe te perbashketen ne nje gjendje me kalimet e saj 
    //3. te dyja gjendjet ndodhen ne nje nga gjendet e tjera , e eleminojme kete gjendje pasi ndodhet nje here
    initializeMarkedStates(markedPairOfStates,unmarkedPairOfStates);
    //debugger;
    var check = true;
    var count = 1;
    while(count > 0){
        count = 0;
        for (var iterator = DFA_states.values(), val= null; val=iterator.next().value;) {
            if (unmarkedPairOfStates[val]) {
                var i = 0;
                console.log(unmarkedPairOfStates[val][i]);
                while(unmarkedPairOfStates[val][i]) {
                    for (var second_iterator = NFA_alphabet.values(), second_val= null; second_val=second_iterator.next().value;) {
                        var first_state,second_state;
                        var firstIndex = DFA_transitions_dictionary[val].indexOf(second_val);
                        var secondIndex = DFA_transitions_dictionary[unmarkedPairOfStates[val][i]].indexOf(second_val);
                        if (firstIndex != -1 && secondIndex != -1) {
                            first_state = DFA_transitions_dictionary[val][firstIndex+1];
                            second_state = DFA_transitions_dictionary[unmarkedPairOfStates[val][i]][secondIndex+1];
                            if(checkForOtherMarkedPairs(first_state,second_state,markedPairOfStates,unmarkedPairOfStates,count,val,unmarkedPairOfStates[val][i])){
                                count++;
                                i--;
                                break;
                            }
                        }
                    }
                    i++;
                }
            } 
        }
    }
    //debugger;
    var array_of_new_states = [];
    for (var iterator = DFA_states.values(), val= null; val=iterator.next().value;) {
        if (unmarkedPairOfStates[val]) {
            for (let i = 0; i < unmarkedPairOfStates[val].length; i++) {
                var first_element = val;
                var second_element = unmarkedPairOfStates[val][i];
                if (array_of_new_states.length == 0) {
                    var tmp_array = [];
                    tmp_array.push(first_element);
                    tmp_array.push(second_element);
                    array_of_new_states.push(tmp_array);
                }
                else{
                    var check = true;
                    for (let j = 0; j < array_of_new_states.length; j++) {
                        var element_to_add = [];
                        if (array_of_new_states[j].includes(first_element)) {
                            if(!array_of_new_states[j].includes(second_element)){
                                array_of_new_states[j].push(second_element);
                            }
                            check = false;
                        }
                        else if(array_of_new_states[j].includes(second_element)){
                            array_of_new_states[j].push(first_element);
                            check = false;
                        }
                    }
                    if(check){
                        var tmp_array = [];
                        tmp_array.push(first_element);
                        tmp_array.push(second_element);
                        array_of_new_states.push(tmp_array);
                    } 
                }
            }
        }
    }
    //for length of new states array
    //for length of DFA transitions check if state is contained in teh new state
    debugger;
    if(array_of_new_states.length > 0){
        for (let i = 0; i < array_of_new_states.length; i++) {
            var tmp = array_of_new_states[i];
            var new_state = tmp.join("");
            var count = 0;
            for (var iterator = DFA_states.values(), val= null; val=iterator.next().value;) {
                if (tmp.includes(val) && count == 0){
                    for (var second_iterator = NFA_alphabet.values(), second_value= null; second_value=second_iterator.next().value;) {
                        var indexOfAlphabetElement = DFA_transitions_dictionary[val].indexOf(second_value);
                        var arriving_state = DFA_transitions_dictionary[val][indexOfAlphabetElement+1];
                        if (tmp.includes(arriving_state)) {
                            addElementToDFAtransitionsDictionary(new_state,second_value,new_state);
                        }
                        else{
                            addElementToDFAtransitionsDictionary(new_state,second_value,arriving_state);
                        }
                    }
                    count++;
                }
                else if(!tmp.includes(val)){
                    for (var second_iterator = NFA_alphabet.values(), second_value= null; second_value=second_iterator.next().value;) {
                        var indexOfAlphabetElement = DFA_transitions_dictionary[val].indexOf(second_value);
                        var arriving_state = DFA_transitions_dictionary[val][indexOfAlphabetElement+1];
                        if (tmp.includes(arriving_state)) {
                            DFA_transitions_dictionary[val][indexOfAlphabetElement+1] = new_state;
                        }
                    }
                }
            }
            minimized_DFA_states.add(new_state);
            DFA_states.add(new_state);
            var count = 0;
            check = false;
            for (let i = 0; i < tmp.length; i++) {
                const element = tmp[i];
                if (minimized_DFA_final_states.has(element)) {
                    count++;
                }
                if(initial_state == element){
                    check = true;
                }
                minimized_DFA_states.delete(element);
                //delete DFA_transitions_dictionary[element];
            }
            if (count == tmp.length) {
                
                for (let i = 0; i < DFA_automat.final_state.length; i++) {
                    const element = DFA_automat.final_state[i];
                    if(tmp.includes(element)){
                        minimized_DFA_final_states.delete(element);
                    }
                }
                minimized_DFA_final_states.add(new_state);
            }
            if(check){
                minimized_DFA_initial_state = new_state;
            }
        }
    }
    minimized_DFA_automat = new e_NFA(minimized_DFA_initial_state,Array.from(minimized_DFA_final_states.values()),Array.from(minimized_DFA_states.values()),Array.from(NFA_alphabet.values()),DFA_transitions_dictionary);
    dotGraph = minimized_DFA_automat.toGraphForm();
    d3.select("#minimized-dfa").graphviz().zoom(false).renderDot(dotGraph);   
    $("#NFA-warn").hide(); 
    $("#illegal-input").hide(); 
    $("#convert-to-nfa").hide(); 
    $("#convert-to-dfa").hide();
    $("#minimize-dfa").hide();
    $("#error").hide();
})

function checkForOtherMarkedPairs(first_state,second_state,marked,unmarked,count,first_state_to_add,second_state_to_add){
//debugger;
    if(marked[second_state]){
        if ((marked[second_state].includes(first_state))) {
            addPairOfStatestoMarkedStates(second_state_to_add,first_state_to_add,marked,unmarked,false);
            return true;
        }
    }
    if(marked[first_state]){
        if((marked[first_state].includes(second_state))) {
            addPairOfStatestoMarkedStates(first_state_to_add,second_state_to_add,marked,unmarked,true);
            return true;
        }
    }
    return false;
}
function addPairOfStatestoMarkedStates(first_state,second_state,marked,unmarked,check){
    //debugger;
    if (!marked[first_state]) {
        var arr = [];
        arr.push(second_state);
        marked[first_state] = arr;
    }
    else{
        if(!marked[first_state].includes(second_state)){
            marked[first_state].push(second_state); 
        }
    }
    //komanda shembull 
    // 
    console.log(unmarked);
    //console.log(unmarked[first_state].indexOf(second_state));
    if (check) {
        unmarked[first_state].splice(unmarked[first_state].indexOf(second_state),1);
    }
    else{
        unmarked[second_state].splice(unmarked[second_state].indexOf(first_state),1);
    }
}
    

function initializeMarkedStates(marked,unmarked){
    //debugger;
    var length = DFA_automat.states.length;
    for (let i = 0; i < length-1; i++) {
        //veje ktu kontrollin per Error
        for (let j = i+1; j < length; j++) {
            if ((DFA_final_states.has(DFA_automat.states[i]) && !DFA_final_states.has(DFA_automat.states[j]))) {
                if (!marked[DFA_automat.states[j]]) {
                    var arr = [];
                    arr.push(DFA_automat.states[i]);
                    marked[DFA_automat.states[j]] = arr;
                }
                else{
                    if(!marked[DFA_automat.states[j]].includes(DFA_automat.states[i])){
                        marked[DFA_automat.states[j]].push(DFA_automat.states[i]); 
                    }
                }
            }
            else if(!DFA_final_states.has(DFA_automat.states[i]) && DFA_final_states.has(DFA_automat.states[j])){
                if (!marked[DFA_automat.states[i]]) {
                    var arr = [];
                    arr.push(DFA_automat.states[j]);
                    marked[DFA_automat.states[i]] = arr;
                }
                else{
                    if(!marked[DFA_automat.states[i]].includes(DFA_automat.states[j])){
                        marked[DFA_automat.states[i]].push(DFA_automat.states[j]);
                    }
                    
                }
            }
            else{
                if (!unmarked[DFA_automat.states[i]]) {
                    var arr = [];
                    arr.push(DFA_automat.states[j]);
                    unmarked[DFA_automat.states[i]] = arr;
                }
                else{
                console.log(unmarked[DFA_automat.states[i]]);
                console.log(DFA_automat.states[j]);
                console.log(unmarked[DFA_automat.states[i]].includes(DFA_automat.states[j]));
                    if(!unmarked[DFA_automat.states[i]].includes(DFA_automat.states[j])){
                        unmarked[DFA_automat.states[i]].push(DFA_automat.states[j]);
                    }   
                }
            }
        }
    }
}
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
    for (var iterator = NFA_final_states.values(), val= null; val=iterator.next().value;) {
        if (state_in_consideration.includes(val)) {
            return true;
        }
    }
    return false;
}


function checkForIncomingEpsilon(first_state,transitive_state,check,string_kalimi,last_split_state_for_ε,last_split_state_for_string){
    debugger;
    if (check) {
        console.log(last_split_state_for_ε + "  " + last_split_state_for_string);
        //dy raste
        //1. Na vijne vetem e derisa arrijme ne nje cikel
        //2. Na vijne vetem e pasi na ka ardhur nje element i ndryshem
        //kujdes kemi rastin kur elementi shkon ne vetvete me =>e ->w 
        //ndryhso kushtin
        if (first_state != transitive_state && !last_split_state_for_ε.includes(transitive_state)) {
            if (transitions_dictionary[transitive_state]) {
                var length_of_state_transitions = transitions_dictionary[transitive_state].length;
                console.log("Gjatesia e transitions per gjendjen" + transitive_state + " : " +length_of_state_transitions);
                e_closure = []; 
                for (let j = 0; j < length_of_state_transitions; j=j+2) { //transitions_dictionary eshte nje object shife si i merret gjatesia
                    console.log(transitions_dictionary[transitive_state]);
                    const element_array = transitions_dictionary[transitive_state][j];
                    console.log(element_array);
                    if(element_array == "ε"){
                        if (NFA_final_states.has(transitions_dictionary[transitive_state][j+1])){
                            NFA_final_states.add(first_state);
                        }
                        if (NFA_transitinons_dictioanry[transitions_dictionary[transitive_state][j+1]] && transitions_dictionary[transitive_state][j+1] != first_state) {
                            completeTransitionsWithExistingOnes(first_state,transitions_dictionary[transitive_state][j+1]);
                        }
                        else{
                            last_split_state_for_ε.push(transitive_state);
                            console.log(last_split_state_for_ε);
                            checkForIncomingEpsilon(first_state,transitions_dictionary[transitive_state][j+1],true,string_kalimi,last_split_state_for_ε,last_split_state_for_string);
                        }
                        
                    }
                     else{
                        if(!checkIfTransitionExists(first_state,element_array,transitions_dictionary[transitive_state][j+1])){
                            addElementTotransitionsDictionary(first_state,element_array,transitions_dictionary[transitive_state][j+1]);
                            console.log(NFA_transitinons_dictioanry[first_state]);
                        }
                        var arr = [];
                        checkForIncomingEpsilon(first_state,transitions_dictionary[transitive_state][j+1],false,element_array,last_split_state_for_ε,arr);
                    }
                }
            }
        }
    }
    else{
        if (!last_split_state_for_string.includes(transitive_state)) {
            console.log(last_split_state_for_ε + "  " + last_split_state_for_string);
            continueChecking(first_state,transitive_state,check,string_kalimi,last_split_state_for_ε,last_split_state_for_string);
        }
    }
}
function continueChecking(first_state,transitive_state,check,string_kalimi,last_split_state_for_ε,last_split_state_for_string){
    debugger;
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
                last_split_state_for_string.push(transitive_state);
                checkForIncomingEpsilon(first_state,transitions_dictionary[transitive_state][j+1],false,string_kalimi,last_split_state_for_ε,last_split_state_for_string);
            }
        }
    }    
}
function completeTransitionsWithExistingOnes(initial_state,state){
    if (NFA_transitinons_dictioanry[state]) {
        for (let i = 0; i < NFA_transitinons_dictioanry[state].length; i=i+2) {
            var tmp = NFA_transitinons_dictioanry[state];
            if(!checkIfTransitionExists(initial_state,tmp[i],tmp[i+1])){
                addElementTotransitionsDictionary(initial_state,tmp[i],tmp[i+1]);
            }
        }
    }
}

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
    if (DFA_transitions_dictionary[tmp] == null) {
        var gjendjet = []; 
        gjendjet.push(string);
        gjendjet.push(second_value);
        DFA_transitions_dictionary[tmp] = gjendjet;
    }
    else{
        DFA_transitions_dictionary[tmp].push(string);
        DFA_transitions_dictionary[tmp].push(second_value);   
    }
    console.log(DFA_transitions_dictionary);
}
function createDictionaryOfTransitions(val,string,second_value){
    // debugger;
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
function completeNFA(initial_state,final_state,first_state,transition_string,last_state){
    debugger;
    if (initial_state && final_state && first_state && transition_string && last_state) {
        //alert( initial_state + final_state + first_state + transition_string + last_state);
        var check = true;
        var format = /^[a-zA-Z0-9- ]*$/;
        var second_format = /^[,a-zA-Z0-9- ]*$/;
        var string_format = /^[εa-zA-Z0-9- ]*$/;
        
        if(!(format.test(initial_state) && second_format.test(final_state) &&
        format.test(first_state) && string_format.test(transition_string) && format.test(last_state))){
            check = false;
        } 
        if(check){
            if (transitions_dictionary[first_state]){
                for (let i = 0; i < transitions_dictionary[first_state].length; i=i+2) {
                    if (transitions_dictionary[first_state][i] == transition_string
                        && transitions_dictionary[first_state][i+1] == last_state) {
                            $("#error").show();
                            $("#NFA-warn").hide(); 
                            $("#illegal-input").hide(); 
                            $("#convert-to-nfa").show(); 
                            $("#convert-to-dfa").hide();
                            $("#minimize-dfa").hide();
                            check = false;
                    }  
                }
            }
            if(check == true){
                createDictionaryOfTransitions(first_state,transition_string,last_state);
                $("#NFA-warn").hide(); 
                $("#illegal-input").hide(); 
                $("#convert-to-nfa").show(); 
                $("#convert-to-dfa").hide();
                $("#minimize-dfa").hide();
                $("#error").hide();
            }
                //debugger;
            alphabet.add(transition_string);
            //alert(states);
            if(e_NFA_automat == null){
                states.add(initial_state);
                var temp = final_state.split(",");
                addToFinalStates(states,final_states,temp);
                states.add(first_state).add(last_state);
                e_NFA_automat = new e_NFA(initial_state,Array.from(final_states.values()),Array.from(states.values()),Array.from(alphabet.values()),transitions_dictionary);
            }
            else{
                var temp = final_state.split(",");
                addToFinalStates(states,final_states,temp);
                states.add(first_state).add(last_state); 
                console.log(Array.from(final_states.values()));
                e_NFA_automat = new e_NFA(initial_state,Array.from(final_states.values()),Array.from(states.values()),Array.from(alphabet.values()),transitions_dictionary);
            }
            var dotGraph = e_NFA_automat.toGraphForm();
            d3.select("#current-nfa").graphviz().zoom(false).renderDot(dotGraph);
        }
        else{
            $("#NFA-warn").hide(); 
            $("#illegal-input").show(); 
            $("#convert-to-nfa").hide(); 
            $("#convert-to-dfa").hide();
            $("#minimize-dfa").hide();
            $("#error").hide();
        }
    }
}
function addToFinalStates(statesSet,finalStatesSet,statesToAdd){
    debugger;
    for (let index = 0; index < statesToAdd.length; index++) {
        const element = statesToAdd[index];
        statesSet.add(element);
        finalStatesSet.add(element);
    }
}
