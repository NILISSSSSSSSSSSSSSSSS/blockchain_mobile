export const systemConfigMixins = {
    data(){
        return {
            systemConfig: {
                siteName: "",
                siteDomain: ""
            }
        }
    },
    created(){
        let config = localStorage.getItem("systemConfig") || ""
        // console.log(config)
        if(config){
            let configObj = JSON.parse(config)
            this.systemConfig.siteName = configObj.siteName || ""
            this.systemConfig.siteDomain = configObj.siteDomain || ""
        }
    }
}