import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, X, Check } from 'lucide-react';

const allCountries = [
  { name: "Afghanistan", code: "AF", dial: "+93", flag: "🇦🇫" },
  { name: "Albania", code: "AL", dial: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "DZ", dial: "+213", flag: "🇩🇿" },
  { name: "American Samoa", code: "AS", dial: "+1-684", flag: "🇦🇸" },
  { name: "Andorra", code: "AD", dial: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "AO", dial: "+244", flag: "🇦🇴" },
  { name: "Anguilla", code: "AI", dial: "+1-264", flag: "🇦🇮" },
  { name: "Antarctica", code: "AQ", dial: "+672", flag: "🇦🇶" },
  { name: "Antigua and Barbuda", code: "AG", dial: "+1-268", flag: "🇦🇬" },
  { name: "Argentina", code: "AR", dial: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "AM", dial: "+374", flag: "🇦🇲" },
  { name: "Aruba", code: "AW", dial: "+297", flag: "🇦🇼" },
  { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "AT", dial: "+43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "AZ", dial: "+994", flag: "🇦🇿" },
  { name: "Bahamas", code: "BS", dial: "+1-242", flag: "🇧🇸" },
  { name: "Bahrain", code: "BH", dial: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "BD", dial: "+880", flag: "🇧🇩" },
  { name: "Barbados", code: "BB", dial: "+1-246", flag: "🇧🇧" },
  { name: "Belarus", code: "BY", dial: "+375", flag: "🇧🇾" },
  { name: "Belgium", code: "BE", dial: "+32", flag: "🇧🇪" },
  { name: "Belize", code: "BZ", dial: "+501", flag: "🇧🇿" },
  { name: "Benin", code: "BJ", dial: "+229", flag: "🇧🇯" },
  { name: "Bermuda", code: "BM", dial: "+1-441", flag: "🇧🇲" },
  { name: "Bhutan", code: "BT", dial: "+975", flag: "🇧🇹" },
  { name: "Bolivia", code: "BO", dial: "+591", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "BA", dial: "+387", flag: "🇧🇦" },
  { name: "Botswana", code: "BW", dial: "+267", flag: "🇧🇼" },
  { name: "Brazil", code: "BR", dial: "+55", flag: "🇧🇷" },
  { name: "British Indian Ocean Territory", code: "IO", dial: "+246", flag: "🇮🇴" },
  { name: "British Virgin Islands", code: "VG", dial: "+1-284", flag: "🇻🇬" },
  { name: "Brunei", code: "BN", dial: "+673", flag: "🇧🇳" },
  { name: "Bulgaria", code: "BG", dial: "+359", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "BF", dial: "+226", flag: "🇧🇫" },
  { name: "Burundi", code: "BI", dial: "+257", flag: "🇧🇮" },
  { name: "Cambodia", code: "KH", dial: "+855", flag: "🇰🇭" },
  { name: "Cameroon", code: "CM", dial: "+237", flag: "🇨🇲" },
  { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦" },
  { name: "Cape Verde", code: "CV", dial: "+238", flag: "🇨🇻" },
  { name: "Cayman Islands", code: "KY", dial: "+1-345", flag: "🇰🇾" },
  { name: "Central African Republic", code: "CF", dial: "+236", flag: "🇨🇫" },
  { name: "Chad", code: "TD", dial: "+235", flag: "🇹🇩" },
  { name: "Chile", code: "CL", dial: "+56", flag: "🇨🇱" },
  { name: "China", code: "CN", dial: "+86", flag: "🇨🇳" },
  { name: "Christmas Island", code: "CX", dial: "+61", flag: "🇨🇽" },
  { name: "Cocos Islands", code: "CC", dial: "+61", flag: "🇨🇨" },
  { name: "Colombia", code: "CO", dial: "+57", flag: "🇨🇴" },
  { name: "Comoros", code: "KM", dial: "+269", flag: "🇰🇲" },
  { name: "Cook Islands", code: "CK", dial: "+682", flag: "🇨🇰" },
  { name: "Costa Rica", code: "CR", dial: "+506", flag: "🇨🇷" },
  { name: "Croatia", code: "HR", dial: "+385", flag: "🇭🇷" },
  { name: "Cuba", code: "CU", dial: "+53", flag: "🇨🇺" },
  { name: "Curacao", code: "CW", dial: "+599", flag: "🇨🇼" },
  { name: "Cyprus", code: "CY", dial: "+357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "CZ", dial: "+420", flag: "🇨🇿" },
  { name: "Democratic Republic of the Congo", code: "CD", dial: "+243", flag: "🇨🇩" },
  { name: "Denmark", code: "DK", dial: "+45", flag: "🇩🇰" },
  { name: "Djibouti", code: "DJ", dial: "+253", flag: "🇩🇯" },
  { name: "Dominica", code: "DM", dial: "+1-767", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "DO", dial: "+1-809", flag: "🇩🇴" },
  { name: "East Timor", code: "TL", dial: "+670", flag: "🇹🇱" },
  { name: "Ecuador", code: "EC", dial: "+593", flag: "🇪🇨" },
  { name: "Egypt", code: "EG", dial: "+20", flag: "🇪🇬" },
  { name: "El Salvador", code: "SV", dial: "+503", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "GQ", dial: "+240", flag: "🇬🇶" },
  { name: "Eritrea", code: "ER", dial: "+291", flag: "🇪🇷" },
  { name: "Estonia", code: "EE", dial: "+372", flag: "🇪🇪" },
  { name: "Ethiopia", code: "ET", dial: "+251", flag: "🇪🇹" },
  { name: "Falkland Islands", code: "FK", dial: "+500", flag: "🇫🇰" },
  { name: "Faroe Islands", code: "FO", dial: "+298", flag: "🇫🇴" },
  { name: "Fiji", code: "FJ", dial: "+679", flag: "🇫🇯" },
  { name: "Finland", code: "FI", dial: "+358", flag: "🇫🇮" },
  { name: "France", code: "FR", dial: "+33", flag: "🇫🇷" },
  { name: "French Polynesia", code: "PF", dial: "+689", flag: "🇵🇫" },
  { name: "Gabon", code: "GA", dial: "+241", flag: "🇬🇦" },
  { name: "Gambia", code: "GM", dial: "+220", flag: "🇬🇲" },
  { name: "Georgia", code: "GE", dial: "+995", flag: "🇬🇪" },
  { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪" },
  { name: "Ghana", code: "GH", dial: "+233", flag: "🇬🇭" },
  { name: "Gibraltar", code: "GI", dial: "+350", flag: "🇬🇮" },
  { name: "Greece", code: "GR", dial: "+30", flag: "🇬🇷" },
  { name: "Greenland", code: "GL", dial: "+299", flag: "🇬🇱" },
  { name: "Grenada", code: "GD", dial: "+1-473", flag: "🇬🇩" },
  { name: "Guam", code: "GU", dial: "+1-671", flag: "🇬🇺" },
  { name: "Guatemala", code: "GT", dial: "+502", flag: "🇬🇹" },
  { name: "Guernsey", code: "GG", dial: "+44-1481", flag: "🇬🇬" },
  { name: "Guinea", code: "GN", dial: "+224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "GW", dial: "+245", flag: "🇬🇼" },
  { name: "Guyana", code: "GY", dial: "+592", flag: "🇬🇾" },
  { name: "Haiti", code: "HT", dial: "+509", flag: "🇭🇹" },
  { name: "Honduras", code: "HN", dial: "+504", flag: "🇭🇳" },
  { name: "Hong Kong", code: "HK", dial: "+852", flag: "🇭🇰" },
  { name: "Hungary", code: "HU", dial: "+36", flag: "🇭🇺" },
  { name: "Iceland", code: "IS", dial: "+354", flag: "🇮🇸" },
  { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "ID", dial: "+62", flag: "🇮🇩" },
  { name: "Iran", code: "IR", dial: "+98", flag: "🇮🇷" },
  { name: "Iraq", code: "IQ", dial: "+964", flag: "🇮🇶" },
  { name: "Ireland", code: "IE", dial: "+353", flag: "🇮🇪" },
  { name: "Isle of Man", code: "IM", dial: "+44-1624", flag: "🇮🇲" },
  { name: "Israel", code: "IL", dial: "+972", flag: "🇮🇱" },
  { name: "Italy", code: "IT", dial: "+39", flag: "🇮🇹" },
  { name: "Ivory Coast", code: "CI", dial: "+225", flag: "🇨🇮" },
  { name: "Jamaica", code: "JM", dial: "+1-876", flag: "🇯🇲" },
  { name: "Japan", code: "JP", dial: "+81", flag: "🇯🇵" },
  { name: "Jersey", code: "JE", dial: "+44-1534", flag: "🇯🇪" },
  { name: "Jordan", code: "JO", dial: "+962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "KZ", dial: "+7", flag: "🇰🇿" },
  { name: "Kenya", code: "KE", dial: "+254", flag: "🇰🇪" },
  { name: "Kiribati", code: "KI", dial: "+686", flag: "🇰🇮" },
  { name: "Kosovo", code: "XK", dial: "+383", flag: "🇽🇰" },
  { name: "Kuwait", code: "KW", dial: "+965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "KG", dial: "+996", flag: "🇰🇬" },
  { name: "Laos", code: "LA", dial: "+856", flag: "🇱🇦" },
  { name: "Latvia", code: "LV", dial: "+371", flag: "🇱🇻" },
  { name: "Lebanon", code: "LB", dial: "+961", flag: "🇱🇧" },
  { name: "Lesotho", code: "LS", dial: "+266", flag: "🇱🇸" },
  { name: "Liberia", code: "LR", dial: "+231", flag: "🇱🇷" },
  { name: "Libya", code: "LY", dial: "+218", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "LI", dial: "+423", flag: "🇱🇮" },
  { name: "Lithuania", code: "LT", dial: "+370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "LU", dial: "+352", flag: "🇱🇺" },
  { name: "Macau", code: "MO", dial: "+853", flag: "🇲🇴" },
  { name: "Macedonia", code: "MK", dial: "+389", flag: "🇲🇰" },
  { name: "Madagascar", code: "MG", dial: "+261", flag: "🇲🇬" },
  { name: "Malawi", code: "MW", dial: "+265", flag: "🇲🇼" },
  { name: "Malaysia", code: "MY", dial: "+60", flag: "🇲🇾" },
  { name: "Maldives", code: "MV", dial: "+960", flag: "🇲🇻" },
  { name: "Mali", code: "ML", dial: "+223", flag: "🇲🇱" },
  { name: "Malta", code: "MT", dial: "+356", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "MH", dial: "+692", flag: "🇲🇭" },
  { name: "Mauritania", code: "MR", dial: "+222", flag: "🇲🇷" },
  { name: "Mauritius", code: "MU", dial: "+230", flag: "🇲🇺" },
  { name: "Mayotte", code: "YT", dial: "+262", flag: "🇾🇹" },
  { name: "Mexico", code: "MX", dial: "+52", flag: "🇲🇽" },
  { name: "Micronesia", code: "FM", dial: "+691", flag: "🇫🇲" },
  { name: "Moldova", code: "MD", dial: "+373", flag: "🇲🇩" },
  { name: "Monaco", code: "MC", dial: "+377", flag: "🇲🇨" },
  { name: "Mongolia", code: "MN", dial: "+976", flag: "🇲🇳" },
  { name: "Montenegro", code: "ME", dial: "+382", flag: "🇲🇪" },
  { name: "Montserrat", code: "MS", dial: "+1-664", flag: "🇲🇸" },
  { name: "Morocco", code: "MA", dial: "+212", flag: "🇲🇦" },
  { name: "Mozambique", code: "MZ", dial: "+258", flag: "🇲🇿" },
  { name: "Myanmar", code: "MM", dial: "+95", flag: "🇲🇲" },
  { name: "Namibia", code: "NA", dial: "+264", flag: "🇳🇦" },
  { name: "Nauru", code: "NR", dial: "+674", flag: "🇳🇷" },
  { name: "Nepal", code: "NP", dial: "+977", flag: "🇳🇵" },
  { name: "Netherlands", code: "NL", dial: "+31", flag: "🇳🇱" },
  { name: "Netherlands Antilles", code: "AN", dial: "+599", flag: "🇦🇳" },
  { name: "New Caledonia", code: "NC", dial: "+687", flag: "🇳🇨" },
  { name: "New Zealand", code: "NZ", dial: "+64", flag: "🇳🇿" },
  { name: "Nicaragua", code: "NI", dial: "+505", flag: "🇳🇮" },
  { name: "Niger", code: "NE", dial: "+227", flag: "🇳🇪" },
  { name: "Nigeria", code: "NG", dial: "+234", flag: "🇳🇬" },
  { name: "Niue", code: "NU", dial: "+683", flag: "🇳🇺" },
  { name: "North Korea", code: "KP", dial: "+850", flag: "🇰🇵" },
  { name: "Northern Mariana Islands", code: "MP", dial: "+1-670", flag: "🇲🇵" },
  { name: "Norway", code: "NO", dial: "+47", flag: "🇳🇴" },
  { name: "Oman", code: "OM", dial: "+968", flag: "🇴🇲" },
  { name: "Pakistan", code: "PK", dial: "+92", flag: "🇵🇰" },
  { name: "Palau", code: "PW", dial: "+680", flag: "🇵🇼" },
  { name: "Palestine", code: "PS", dial: "+970", flag: "🇵🇸" },
  { name: "Panama", code: "PA", dial: "+507", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "PG", dial: "+675", flag: "🇵🇬" },
  { name: "Paraguay", code: "PY", dial: "+595", flag: "🇵🇾" },
  { name: "Peru", code: "PE", dial: "+51", flag: "🇵🇪" },
  { name: "Philippines", code: "PH", dial: "+63", flag: "🇵🇭" },
  { name: "Pitcairn", code: "PN", dial: "+64", flag: "🇵🇳" },
  { name: "Poland", code: "PL", dial: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "PT", dial: "+351", flag: "🇵🇹" },
  { name: "Puerto Rico", code: "PR", dial: "+1-787", flag: "🇵🇷" },
  { name: "Qatar", code: "QA", dial: "+974", flag: "🇶🇦" },
  { name: "Republic of the Congo", code: "CG", dial: "+242", flag: "🇨🇬" },
  { name: "Reunion", code: "RE", dial: "+262", flag: "🇷🇪" },
  { name: "Romania", code: "RO", dial: "+40", flag: "🇷🇴" },
  { name: "Russia", code: "RU", dial: "+7", flag: "🇷🇺" },
  { name: "Rwanda", code: "RW", dial: "+250", flag: "🇷🇼" },
  { name: "Saint Barthelemy", code: "BL", dial: "+590", flag: "🇧🇱" },
  { name: "Saint Helena", code: "SH", dial: "+290", flag: "🇸🇭" },
  { name: "Saint Kitts and Nevis", code: "KN", dial: "+1-869", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "LC", dial: "+1-758", flag: "🇱🇨" },
  { name: "Saint Martin", code: "MF", dial: "+590", flag: "🇲🇫" },
  { name: "Saint Pierre and Miquelon", code: "PM", dial: "+508", flag: "🇵🇲" },
  { name: "Saint Vincent and the Grenadines", code: "VC", dial: "+1-784", flag: "🇻🇨" },
  { name: "Samoa", code: "WS", dial: "+685", flag: "🇼🇸" },
  { name: "San Marino", code: "SM", dial: "+378", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "ST", dial: "+239", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "SA", dial: "+966", flag: "🇸🇦" },
  { name: "Senegal", code: "SN", dial: "+221", flag: "🇸🇳" },
  { name: "Serbia", code: "RS", dial: "+381", flag: "🇷🇸" },
  { name: "Seychelles", code: "SC", dial: "+248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "SL", dial: "+232", flag: "🇸🇱" },
  { name: "Singapore", code: "SG", dial: "+65", flag: "🇸🇬" },
  { name: "Sint Maarten", code: "SX", dial: "+1-721", flag: "🇸🇽" },
  { name: "Slovakia", code: "SK", dial: "+421", flag: "🇸🇰" },
  { name: "Slovenia", code: "SI", dial: "+386", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "SB", dial: "+677", flag: "🇸🇧" },
  { name: "Somalia", code: "SO", dial: "+252", flag: "🇸🇴" },
  { name: "South Africa", code: "ZA", dial: "+27", flag: "🇿🇦" },
  { name: "South Korea", code: "KR", dial: "+82", flag: "🇰🇷" },
  { name: "South Sudan", code: "SS", dial: "+211", flag: "🇸🇸" },
  { name: "Spain", code: "ES", dial: "+34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "LK", dial: "+94", flag: "🇱🇰" },
  { name: "Sudan", code: "SD", dial: "+249", flag: "🇸🇩" },
  { name: "Suriname", code: "SR", dial: "+597", flag: "🇸🇷" },
  { name: "Svalbard and Jan Mayen", code: "SJ", dial: "+47", flag: "🇸🇯" },
  { name: "Swaziland", code: "SZ", dial: "+268", flag: "🇸🇿" },
  { name: "Sweden", code: "SE", dial: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "CH", dial: "+41", flag: "🇨🇭" },
  { name: "Syria", code: "SY", dial: "+963", flag: "🇸🇾" },
  { name: "Taiwan", code: "TW", dial: "+886", flag: "🇹🇼" },
  { name: "Tajikistan", code: "TJ", dial: "+992", flag: "🇹🇯" },
  { name: "Tanzania", code: "TZ", dial: "+255", flag: "🇹🇿" },
  { name: "Thailand", code: "TH", dial: "+66", flag: "🇹🇭" },
  { name: "Togo", code: "TG", dial: "+228", flag: "🇹🇬" },
  { name: "Tokelau", code: "TK", dial: "+690", flag: "🇹🇰" },
  { name: "Tonga", code: "TO", dial: "+676", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "TT", dial: "+1-868", flag: "🇹🇹" },
  { name: "Tunisia", code: "TN", dial: "+216", flag: "🇹🇳" },
  { name: "Turkey", code: "TR", dial: "+90", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "TM", dial: "+993", flag: "🇹🇲" },
  { name: "Turks and Caicos Islands", code: "TC", dial: "+1-649", flag: "🇹🇨" },
  { name: "Tuvalu", code: "TV", dial: "+688", flag: "🇹🇻" },
  { name: "U.S. Virgin Islands", code: "VI", dial: "+1-340", flag: "🇻🇮" },
  { name: "Uganda", code: "UG", dial: "+256", flag: "🇺🇬" },
  { name: "Ukraine", code: "UA", dial: "+380", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "AE", dial: "+971", flag: "🇦🇪" },
  { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧" },
  { name: "United States", code: "US", dial: "+1", flag: "🇺🇸" },
  { name: "Uruguay", code: "UY", dial: "+598", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "UZ", dial: "+998", flag: "🇺🇿" },
  { name: "Vanuatu", code: "VU", dial: "+678", flag: "🇻🇺" },
  { name: "Vatican", code: "VA", dial: "+379", flag: "🇻🇦" },
  { name: "Venezuela", code: "VE", dial: "+58", flag: "🇻🇪" },
  { name: "Vietnam", code: "VN", dial: "+84", flag: "🇻🇳" },
  { name: "Wallis and Futuna", code: "WF", dial: "+681", flag: "🇼🇫" },
  { name: "Western Sahara", code: "EH", dial: "+212", flag: "🇪🇭" },
  { name: "Yemen", code: "YE", dial: "+967", flag: "🇾🇪" },
  { name: "Zambia", code: "ZM", dial: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "ZW", dial: "+263", flag: "🇿🇼" }
].sort((a,b) => a.name.localeCompare(b.name));

const CountrySelector = ({ selected, onSelect, onClose }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return allCountries.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
    );
  }, [search]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-white rounded-[40px] overflow-hidden flex flex-col border border-white/20 shadow-2xl max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-widest text-slate-900 leading-none">Country Selector</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Global Dial Codes</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all flex items-center justify-center shadow-sm group">
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="px-8 py-6 border-b border-slate-100 bg-white">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
            <input 
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-[22px] pl-14 pr-6 py-5 outline-none focus:bg-white focus:border-primary-600 focus:shadow-xl focus:shadow-primary-600/5 transition-all font-bold text-slate-900 placeholder:text-slate-300"
              placeholder="Search country or dial code..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {filtered.map((country) => (
            <button
              key={`${country.code}-${country.dial}`}
              onClick={() => onSelect(country)}
              className={`w-full flex items-center justify-between p-4 px-6 rounded-[24px] transition-all group ${
                selected?.code === country.code 
                  ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20' 
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-5">
                <span className="text-3xl leading-none drop-shadow-sm">{country.flag}</span>
                <div className="text-left font-bold transition-transform group-hover:translate-x-1">
                  <p className={`text-sm font-black italic uppercase leading-tight ${selected?.code === country.code ? 'text-white' : 'text-slate-900'}`}>
                    {country.name}
                  </p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${selected?.code === country.code ? 'text-primary-100' : 'text-slate-400'}`}>
                    {country.code}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-black italic ${selected?.code === country.code ? 'text-white' : 'text-primary-600'}`}>
                  {country.dial}
                </span>
                {selected?.code === country.code && <Check size={18} className="text-white" />}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-300">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <Globe size={32} className="opacity-20 animate-pulse" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest">No matching jurisdictions</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CountrySelector;
export { allCountries };
