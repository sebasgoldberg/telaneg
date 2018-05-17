import Controller from 'sap/ui/core/mvc/Controller';

export default Controller.extend("simplifique.telaneg.controller.TestPage", {

    onNext: function(){
        this.getView().byId('navSteps').nextStep();
        },

    onPrevious: function(){
        this.getView().byId('navSteps').previousStep();
        },

    onEnteringLastStep: function() {
        console.log('Entering last step.');
    },

    onLeavingLastStep: function() {
        console.log('Leaving last step.');
    },

    });

