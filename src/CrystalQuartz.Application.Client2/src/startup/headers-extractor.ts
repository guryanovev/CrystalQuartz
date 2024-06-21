export type LocationAnalyzingResult = {
    headers: null | { [key: string]: string};
    url: string;
}

type CrystalQuartzParentOptions = {
    headers: Record<string, string> | undefined;
}

type CrystalQuartzParentOptionsHolder = {
    ['CQ_OPTIONS']: CrystalQuartzParentOptions | undefined;
}

export const ANALYZE_LOCATION = () : LocationAnalyzingResult => {
    try {
        if (window && window.parent) {
            const options: CrystalQuartzParentOptions | undefined = (window.parent as unknown as CrystalQuartzParentOptionsHolder)['CQ_OPTIONS'];

            if (options !== undefined) {
                return {
                    url: '',
                    headers: options.headers ?? null
                }
            }
        }
    } catch (ex) {
    }

    try {
        const result: Record<string, string> = {};
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
