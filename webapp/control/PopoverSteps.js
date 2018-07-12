import Control from "sap/ui/core/Control";
import ResponsivePopover from "sap/m/ResponsivePopover";
import NavSteps from "./NavSteps";
import Button from "sap/m/Button";
import ButtonType from "sap/m/ButtonType";

/**
 * Popover responsavel de gerenciar a navegação entre as paginas adicionadas no mesmo,
 * e de identificar quando finalizou o processamento.
 */
export default ResponsivePopover.extend("simplifique.telaneg.control.PopoverSteps", {

    metadata : {
        properties: {
            nextText: { type: 'string', defaultValue: 'Next' },
            cancelText: { type: 'string', defaultValue: 'Cancel' },
            finishText: { type: 'string', defaultValue: 'Finish' },
            },
        defaultAggregation : "content",
        events:{
            finish: {},
            enteringLastStep: {},
            },
    },

    getNavSteps: function(){
        return this.navSteps;
        },

    toPreviousStep: function() {
        this.navSteps.previousStep();
    },

    updateStepButtonText: function(){
        if (this.navSteps.inLastStep())
            this.setLastStepContext();
        else
            this.setPreviousStepContext();
        },

    setCancelText: function(sValue) {
        this.setProperty('cancelText', sValue);
        this.cancelButton.setText(this.getCancelText());
    },

    initPages: function(){
        let aPages = this.navSteps.getAggregation('pages');
        if (!aPages)
            return;
        aPages.forEach( 
            (page, index) => {
                if (index == 0)
                    page.setShowNavButton(false);
                else if (!page.getShowNavButton()){
                    page.setShowNavButton(true);
                    page.attachNavButtonPress(
                        () => this.navSteps.previousStep() );
                    }
                });
        },

    addContent: function(oNavContainer){
        if (this.navSteps)
            throw "PopoverSteps should have only one control in content aggregation a its type should be NavSteps."
        this.addAggregation('content', oNavContainer);
        this.navSteps = oNavContainer;
        this.navSteps.attachEnteringLastStep( () => this.setLastStepContext() );
        this.navSteps.attachLeavingLastStep( () => this.setPreviousStepContext() );
        this.initPages();
        this.updateStepButtonText();
        },

    setLastStepContext: function(){
        this.nextButton.setText(this.getFinishText());
        this.fireEnteringLastStep();
        },

    setPreviousStepContext: function() {
        this.nextButton.setText(this.getNextText());
        },

    init: function(...args){ 

        ResponsivePopover.prototype.init.apply(this, ...args)

        this.nextButton = new Button({
            text: this.getNextText(),
            type: ButtonType.Emphasized,
            press: () =>{
                if (this.navSteps.inLastStep())
                    this.fireFinish()
                else
                    this.navSteps.nextStep();
                },
            });

        this.cancelButton = new Button({
            text: this.getCancelText(),
            press: () => this.close(),
            });


        this.setBeginButton(this.nextButton);
        this.setEndButton(this.cancelButton);

    },

    renderer: {}

});

