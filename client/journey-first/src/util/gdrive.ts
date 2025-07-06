declare var google: any, CLIENT_ID: string, SCOPES: string[], gapi: any;

let access_token: string|null = null;
export async function ensureAuth(forceRedo?: boolean) {
  if (access_token && (!forceRedo)) {
    return;
  }
  return new Promise(resolve => google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES.join(' '),
    prompt: '',
    callback: (auth: {access_token: string}) => {
      access_token = auth.access_token;
      resolve(null);
    },
  }).requestAccessToken());
}
export async function createAndUploadFile(name: string, content: any): Promise<{id: string, name: string}> {
  const fileMetadata = {
    name: name + (name.endsWith(".journey") ? "" : ".journey"),
    mimeType: 'application/octet-stream',
  };

  const boundary = '-------314159265358975323846';
  const delimiter = '\r\n--' + boundary + '\r\n';
  const close_delim = '\r\n--' + boundary + '--';

  const contentType = 'multipart/related; boundary=' + boundary;
  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(fileMetadata) +
    delimiter +
    'Content-Type: ' +
    fileMetadata.mimeType +
    '\r\n' +
    '\r\n' +
    JSON.stringify(content) +
    close_delim;

  const response: {result: {id: string, name: string}} = await gapi.client.request({
    path: '/upload/drive/v3/files',
    method: 'POST',
    params: { uploadType: 'multipart' },
    headers: {
      'Content-Type': contentType,
      'Authorization': 'Bearer ' + access_token,
    },
    body: multipartRequestBody,
  });
  //console.log(response);
  return response.result; // id and name are in it
}
export async function updateFileContent(id: string, content: any) {
  const response: {result: {id: string, name: string}} = await gapi.client.request({
    path: '/upload/drive/v3/files/' + id,
    method: 'PATCH',
    params: { uploadType: 'media' },
    headers: {
      'Content-Type': 'application/octet-stream',
      'Authorization': 'Bearer ' + access_token,
    },
    body: JSON.stringify(content),
  });
  //console.log(response);
  return response.result;
}
export async function loadFileList(secondAttempt?: boolean): Promise<{id: string, name: string}[]> { // might call after long time
  try {
    const response: {result: {files: {id: string, name: string}[]}} = await gapi.client.request({
      path: '/drive/v3/files',
      method: 'GET',
      params: { includeItemsFromAllDrives: true, supportsAllDrives: true, orderBy: 'name', pageSize: 100 },
      headers: {
        'Authorization': 'Bearer ' + access_token,
      },
    });
    //console.log(response);
    return response.result.files;
  } catch (_e) {
    if (secondAttempt) {
      throw _e;
    } else {
      await ensureAuth(true);
      return loadFileList(true);
    }
  }
}
export async function loadFile(id: string): Promise<any> {
  const response: {body: string} = await gapi.client.request({
    path: '/drive/v3/files/' + id,
    method: 'GET',
    params: {
      alt: 'media', // download contents
    },
    headers: {
      'Authorization': 'Bearer ' + access_token,
    },
  });
  //console.log(response);
  return JSON.parse(response.body);
}