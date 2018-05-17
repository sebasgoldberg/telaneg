import NavContainer from "sap/m/NavContainer";

export default NavContainer.extend("simplifique.telaneg.control.NavSteps", {

    metadata : {
        events:{
            enteringLastStep: {},
            leavingLastStep: {},
            }
    },

    checkPagesDefined: function(){
        if (this.getPages().length == 0)
            throw "ERROR: No pages defined";
    },

    getCurrentStep: function(){
        if (this.currentStep !== undefined)
            return this.currentStep;
        this.checkPagesDefined();
        return this.currentStep = 0;
    },

    inFirstStep: function () {
        return this.getCurrentStep() == 0;
    },

    inLastStep: function () {
        return this.getCurrentStep() == (this.getPages().length-1);
    },

    toCurrentStep: function(){
        this.to(this.getPages()[this.currentStep])
    },

    nextStep: function(){
        if (this.inLastStep())
            throw "ERROR: This is the last step.";
        this.currentStep++;
        this.toCurrentStep();
        if (this.inLastStep())
            this.fireEnteringLastStep();
    },

    previousStep: function(){
        if (this.inFirstStep())
            throw "ERROR: This is the first step.";
        if (this.inLastStep())
            this.fireLeavingLastStep();
        this.currentStep--;
        this.back();
    },

    renderer: {},

});

