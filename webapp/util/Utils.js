sap.ui.define([], function() {
    "use strict"; 
    return {
        getDiffDays: function(srcDate, dstDate) {
            let dateParts = dstDate.split(".");
            let dst = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
        
            dateParts = srcDate.split(".");
            let src = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
        
            let timeDiff = Math.abs(dst.getTime() - src.getTime());
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
            return diffDays;
        }
    };
 });