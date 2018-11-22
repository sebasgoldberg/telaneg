import ManagedObject from "sap/ui/base/ManagedObject";
import formatter from "cp/simplifique/telaneg/model/formatter";

export default ManagedObject.extend("cp.simplifique.telaneg.controller.BaseTablePopover",{

    formatter: formatter,

    constructor : function (oView) {
        this._oView = oView;    
    },

    /**
     * Redefinir este metodo de forma de retornar o path do fragment que define o popover.
     * Exemplo: namespace.view.NomeDoFragment (sem colocar fragment.xml)
     */
    getPopoverFragmentName: function() {
        throw 'Método não implementado';
    },

    /**
     * Redefinir este metodo de forma de etornar o path relativo do aggregation dos
     * itens da tabela.
     * Exemplo: return 'venda'
     */
    getAggregationPath: function() {
        throw 'Método não implementado';
    },

    /**
     * Deve retornar um objeto a ser utilizado na chamada do Model.addEntry.
     */
    getObjectToBeAdded: function() {
        throw 'Método não implementado';
    },

    /**
     * Deve retornar a tabela.
     */
    getTable: function() {
        throw 'Método não implementado';
    },

    /**
     * Deve retornar o popover a ser utilizado na adição de novas entradas.
     */
    getAddPopover: function() {
        return this.getView().byId('popoverObterStock');
    },

    /******* HANDLERS ****/

    onAdd: async function() {
        try {
            this.getAddPopover().close();
            this.setBusy();
            await this.add();
            this.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            this.setFree();
        }
    },

    onDelete: async function({solicitarConfirmacao=true}) {
        try {
            if (solicitarConfirmacao)
                if (!(await this.temCertezaDeEliminar()))
                    return;
            this.setBusy()
            await this.eliminarSelecionadas();
            this.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            this.setFree();
        }
    },

    onDeleteSemConfirmar: function() {
        this.onDelete({solicitarConfirmacao: false})
    },

    onFecharPopover: function() {
        this.popover.close();
    },

    onFecharAddPopover: function() {
        this.getAddPopover().close();
    },

    /********** INTERNAL ******/

    exit : function () {
        delete this._oView;
    },

    hasSameBindingContextPath: function(sPath) {
        let bc = this.popover.getBindingContext();
        if (!bc)
            return false;
        return (bc.getPath() === sPath);
    },

    open : function (sPath, oOpenBy) {
        if (!this.popover){
            this.popover = sap.ui.xmlfragment(this.getView().getId(), this.getPopoverFragmentName(), this);
            this._oView.addDependent(this.popover);
        }

        if (this.hasSameBindingContextPath(sPath))
            // Em casso de ter mesmo contexto, fazemos o refresh,
            // Já que as informações poderia ter atualizado.
            this.refresh();
        else
            this.popover.bindObject(sPath);

        if (this.popover.isOpen())
            this.popover.close()
        else{
            this.popover.openBy(oOpenBy);
        }

    },

    getView: function() {
        return this._oView;
    },

    getBindingContext: function() {
        return this.popover.getBindingContext()
    },

    add: function(){
        let v = this.getView();
        let m = v.getModel();
        let sPathItem = this.getBindingContext().getPath();
        //let oViewData = this.getView().getModel('view').getData();
        return new Promise( (resolve, reject) => {
            m.create(
                `${sPathItem}/${this.getAggregationPath()}`,
                this.getObjectToBeAdded(),
                {
                    success: (...args) => resolve(args),
                    error: (...args) => reject(args),
                    });
            }
        );
    },

    refresh: function() {
        this.getTable().getBinding('items').refresh();
    },

    setBusy: function() {
        this.getTable().setBusy(true);
    },

    setFree: function() {
        this.getTable().setBusy(false);
    },

    eliminar: function(c){
        let m = this.getView().getModel();
        return new Promise( (resolve, reject) => {
            m.remove(
                c.getPath(),
                {
                    success: (...args) => { resolve(...args) },
                    error: (...args) => { reject(...args) },
                }
            );
        });
    },

    eliminarSelecionadas: function() {
        return Promise.all(this.getTable().getSelectedContexts()
            .map( c => this.eliminar(c) ));
    },

    temCertezaDeEliminar: function(attribute) {
        return new Promise(function(fnResolve) {
            sap.m.MessageBox.confirm("Tem certeza que deseja eliminar as entradas selecionadas?", {
                title: "Eliminar Entradas",
                actions: ["Sim", "Não"],
                onClose: function(sActionClicked) {
                    fnResolve(sActionClicked === "Sim");
                }
            });
        });
    },

});


