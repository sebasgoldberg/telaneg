import Button from "sap/m/Button";

/**
 * Botão responsavel de exibir ou ocultar um popover.
 */
export default Button.extend("cp.simplifique.telaneg.control.ButtonPopover",{

    metadata: {
        properties:{
            placement: {type: 'sap.m.PlacementType'}
            },
        defaultAggregation: 'popover',
        aggregations: {
            popover: {
                type: "sap.m.ResponsivePopover",
                multiple: false,
                }
            }
        },

    refreshPlacement: function(){
        let popover = this.getPopover();
        let placement = this.getPlacement();
        if (popover)
            popover.setPlacement(placement);
        },

    setPlacement: function(value){
        this.setProperty('placement', value);
        this.refreshPlacement();
        },

    setPopover: function(value){
        this.setAggregation('popover', value);
        this.refreshPlacement();
        },
    
    init: function(...args){

        if(Button.prototype.init)
            Button.prototype.init.apply(this, ...args);

        this.attachPress( () => {
            let popover = this.getPopover();
            if (popover.isOpen())
                popover.close()
            else
                popover.openBy(this);
            })

        },

    renderer: {},

    });
