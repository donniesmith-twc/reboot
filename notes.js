// Add to csInit ////////////////////////////////////////////////////////////////////////////

	// Reboot Edit - start
	csAd.rebootCheck = function(){
	     try{
	          csAd.ids.locReboot = parent.TWC.pco.getNodeValue('ad','location','loc').loc;
	          csAd.reboot = true;
	     }catch(err){
	          csAd.errors.push("isReboot: "+ err.message);
	          csAd.reboot = false;
	     }
	}

	csAd.rebootCheck();

	if (csAd.reboot) {
	     // Replacing mobagg call with the just the necessary DSX calls for this adaptor, which include
	     // three records: (loc; MORecord; DFRecord)
	     csAddScript("http://dsx.weather.com/wxd/v2/(loc;MORecord;DFRecord)/en_US/(" + csAd.ids.locReboot + ")?api=7bb1c920-7027-4289-9c96-ae5e263980bc&jsonp=csDataSave");
	     if(!navigator.userAgent.match(/MSIE/i)){
	          csAd.dataCheck = setTimeout(csDataFail, 7000);
	     }
	}else{
	     csData();                  
	}
	// Reboot Edit - end

// Modify csSetVars //////////////////////////////////////////////////////////////////////////

	// Reboot Edit - start
	if (csAd.reboot) { // map to reboot data
	     csAd.vars.city = toTitleCase(csAd.data.body[0].doc.cityNm);
	     csAd.vars.state = csAd.data.body[0].doc.stCd;

	     csAd.vars.wxIcon = csAd.data.body[1].doc.MOData.sky;
	     csAd.vars.temp = csAd.data.body[1].doc.MOData.tmpF;
	     csAd.vars.hi = csAd.data.body[2].doc.DFData[0].hiTmpF;
	     if (csAd.vars.hi == undefined) {
	          csAd.vars.hi = "N/A";
	     };
	     csAd.vars.lo = csAd.data.body[2].doc.DFData[0].loTmpF;
	}else{ // use old ds2 mappings
	     csAd.vars.city = csAd.data[0].Location.city;
	     csAd.vars.state = csAd.data[0].Location.state;
	     csAd.vars.wxIcon = csAd.data[0].HiradObservation.wxIcon;
	     csAd.vars.temp = csAd.data[0].HiradObservation.temp;
	     csAd.vars.hi = csAd.data[0].DailyForecasts[0].maxTemp;
	     csAd.vars.lo = csAd.data[0].DailyForecasts[0].minTemp;
	}
	// Reboot Edit - end

Replace csDataSave function with below /////////////////////////////////////////////////////

	// Reboot Edit - start
	function csDataSave(JSON){
	     clearTimeout(csAd.dataCheck);
	     csAd.data = JSON;
	     if (csAd.reboot) {
	          if (JSON.status == 200) {
	               csSetVars();
	          }else{
	               csWriteDefault("csDataSaveReboot: status = "+ JSON.status);
	          }
	     }else{
	          if (csAd.data.length == csAd.dataLocs.length) {
	               csSetVars();
	          }else{
	               csWriteDefault("csDataSave: ds2 error")
	          }     
	     }
	}
	// Reboot Edit - end


// Other Things To Note: ///////////////////////////////////////////////////////////////////////

//	Had to add toTitleCase function for cityNm value that is returned as CAPS
	
		function toTitleCase(str){ // Reboot Edit - start
		    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}// Reboot Edit - end

//	In DS2, the maxTemp and minTemp for the current disappeared at a certain point in the afternoon. Does this happen with DSX?


