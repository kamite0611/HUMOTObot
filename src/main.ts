import { between } from '@holiday-jp/holiday_jp';

const LINE_TOKEN = 'XnXlJBT3ECVXRNJd8ERL7tTPA8fnmw9WfYL4eZHBDtY';

const getHolidays = () => {
  /** */
  const today = new Date();
  const nextDay = new Date();
  nextDay.setMonth(nextDay.getMonth() + 2);
  const holidarys = between(today, nextDay);

  console.log('today', today);
  console.log('nextDay', nextDay);
  console.log('holidarys', holidarys);
};

export function myFunction() {
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName('hoge');
  if (!sheet) return;
  const isActiveCell = sheet.getRange(1, 1);
  const startDateCell = sheet.getRange(2, 2);

  /** スプレットシート1列目 チェックされているか */
  const isActive = isActiveCell.getValue();

  /** スプレットシート2列目 開始日 */
  const startDate = startDateCell.getValue() ? new Date(startDateCell.getValue()) : null;

  if (!isActive) return;

  getHolidays();

  const res = UrlFetchApp.fetch('https://reserve.fumotoppara.net/api/shared/reserve/calendars', {
    headers: {
      'X-Api-Key': '51ff85fe-ca21-4a42-f8cc-cf5f34b964e5',
    },
  });

  const caledersData = JSON.parse(res.getContentText());
  const calendarsSiteDateList = caledersData.calendarsSiteDateList;

  /**  */
  const campStayDataList = calendarsSiteDateList.filter(
    (data: any) => data.siteGroupCd == '01' && data.stayDiv == 'STAY'
  );

  /**  */
  const ikeruData = campStayDataList.filter((data: any) => {
    const date = new Date(data.calDate);

    if (startDate && date < startDate) return false;
    // return date.getDay() == 6;
    return date.getDay() == 6 && data.remainCount > 0;
  });

  if (!ikeruData.length) return;

  let message = 'URL:https://reserve.fumotoppara.net/reserved/reserved-calendar-list';

  ikeruData.map((data: any) => {
    message += `\n${data.calDate}: ${data.remainCount}`;
  });

  const options: any = {
    method: 'post',
    payload: { message: message },
    headers: { Authorization: 'Bearer ' + LINE_TOKEN },
  };

  UrlFetchApp.fetch('https://notify-api.line.me/api/notify', options);
}
