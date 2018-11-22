import BaseDialog from "simplifique/telaneg/base/controller/BaseDialog";

export default BaseDialog.extend("simplifique.telaneg.base.controller.InfoDialog",{

    constructor : function (oView) {
        BaseDialog.prototype.constructor.call(this,
            oView, "simplifique.telaneg.base.view.InfoDialog");
    },

    onNaoVoltarExibir: async function() {

        this.onFechar();

        let v = this.getView();
        let bc = this.dialog.getBindingContext();
        let m = v.getModel();

        try {
            await (new Promise( (resolve, reject) => {
                m.resetChanges();
                m.setProperty(bc.getPath()+'/info/OcultarPopupInfo',true)
                m.submitChanges({
                    success: (...args) => resolve(...args),
                    error: (...args) => reject(...args)
                });
            }));
        } catch (e) {
            m.resetChanges();
            console.error(e);
        }

    },

});


