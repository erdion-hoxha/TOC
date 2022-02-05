class e_NFA{
    constructor(initialState,finalStates,states,alphabet,transitions){
        if (!(typeof initialState === "string" || initialState instanceof String))
            throw new Error("Pritet qe te vije string");

        if (!Array.isArray(finalStates)) {
            console.warn("Expected finalStates in NFA to be an array");
            let arr = [];
            arr.push(finalStates.toString());
            finalStates = arr;
        }

        if (!Array.isArray(alphabet)) {
            console.warn("Expected alphabet in NFA to be an array");
            let arr = [];
            arr.push(alphabet.toString());
            alphabet = arr;
        }

        // if (!Array.isArray(transitions)) {
        //     console.warn("Expected transitions in NFA to be an array");
        //     let arr = [];
        //     arr.push(transitions);
        //     transitions = arr;
        // }
        this.initial_state = initialState;
        this.final_state = finalStates;
        this.alphabet = alphabet;
        this.states = states;
        this.transitions = transitions;
    }
    changeTransitions(transitions){
        debugger;
        this.transitions = transitions;
        var dotGraph = this.toGraphForm();
        return dotGraph;
    }
    changeFinalStates(final_states){
        this.final_states = final_states;
    }
    toGraphForm(){
        debugger;
        var dotGraph = `digraph finite_state_machine { 
        rankdir=LR;
        size="8.5" 
        node [shape = point]; INITIAL_STATE;\n`;
        //console.log(this.final_state.join(","));
        dotGraph +="node [shape = doublecircle];" + this.final_state.join(",") + ";\n";
        dotGraph +="node [shape = circle];\n";
        dotGraph +="INITIAL_STATE ->" + this.initial_state +";\n";            
        // for(var i=0; i<this.transitions.length; i++){
        //     dotGraph += this.transitions[i][0] + " -> " + this.transitions[i][2] + '[label = "' + this.transitions[i][1] + '"];\n';
        // }
        for(var i=0; i<this.states.length; i++){
            var index = this.states[i];
            console.log(this.transitions[index]);
            var tmp = this.transitions[index]
            if(tmp){
                var length = tmp.length;
                console.log(length);
                for (let j = 0; j < length; j=j+2) {
                    const element = this.transitions[index];
                    console.log(element[0] + element[1]);
                    dotGraph += this.states[i] + " -> " + element[j+1] + '[label = "' + element[j] + '"];\n';                
                }
            }
        }
        dotGraph += "}";
        console.log(dotGraph);
        return dotGraph;
    }
    
}
