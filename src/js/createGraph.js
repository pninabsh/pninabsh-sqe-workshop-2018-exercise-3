function deleteUnusedNodes(cfg){
    for(let cfgElement of cfg){
        cfgElement.exception = undefined;
        if(cfgElement.label.startsWith('return')){
            delete cfgElement.normal;
        }
    }
    cfg.splice(0,1);
    cfg[0].parent = undefined; cfg[0].prev = [];
    cfg.splice(cfg.length-1, cfg.length);
    return cfg;
}

function updatePrevNode(cfgElement, nextElement){
    for(let prevElement of cfgElement.prev) {
        if(prevElement.normal){
            prevElement.normal = nextElement.normal;
        }
        else if(prevElement.true){
            prevElement.true = nextElement.normal;
        }
        else if(prevElement.false){
            prevElement.false = nextElement.normal;
        }
    }
}

function mergeNodes(cfg){
    let newCfg = [];
    let minIndex = cfg.length;
    for(let i=0;i<cfg.length; i++){
        if(cfg[i].normal && cfg[i].normal.prev.length === 1 && cfg[i].normal.normal){
            if(i < minIndex){
                minIndex = i;
            }
            cfg[i].normal.label = cfg[i].label + '\n' + cfg[i].normal.label;
            updatePrevNode(cfg[minIndex], cfg[i]);
        }
        else{
            minIndex = cfg.length;
            newCfg.push(cfg[i]);
        }
    }
    return newCfg;
}

export function cleanCFGGraph(cfg){
    deleteUnusedNodes(cfg);
    return mergeNodes(cfg);
}