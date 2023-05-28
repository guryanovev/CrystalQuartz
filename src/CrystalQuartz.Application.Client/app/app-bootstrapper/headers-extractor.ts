export type LocationAnalyzingResult = {
    headers: null | { [key: string]: string};
    url: string;
}

export const ANALYZE_LOCATION = () : LocationAnalyzingResult => {
    try {
        if (window && window.parent && window.parent['CQ_OPTIONS'] && window.parent['CQ_OPTIONS'].headers) {
            return {
                url: '',
                headers: window.parent['CQ_OPTIONS'].headers
            }
        }
    } catch (ex) {
    }

    try {
        const result = {};
        let found = false;

        if (location.search) {
            const queryStringParts = location.search.substr(1).split("&");
            const restParameters: string[] = [];

            for (let i = 0; i < queryStringParts.length; i++) {
                const parts = queryStringParts[i].split("=");
                const paramName = parts[0];

                if (paramName.startsWith('h_')) {
                    result[paramName.substr(2)] = parts[1] && decodeURIComponent(parts[1]);
                    found = true;
                } else {
                    restParameters.push(paramName + '=' + parts[1]);
                }
            }

            if (found) {
                return {
                    headers: result,
                    url: location.pathname + (restParameters.length === 0 ? '' : '?') +
                        restParameters.join('&')
                };
            }
        }
    } catch (ex) {
    }

    return {
        headers: null,
        url: ''
    };
}