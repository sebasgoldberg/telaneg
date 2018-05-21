import Controller from 'sap/ui/core/mvc/Controller';

export default Controller.extend("simplifique.telaneg.controller.TestPage", {

    onFinish: function(oEvent){
        oEvent.getSource().close();
        console.log('FINISH');
    },

});

