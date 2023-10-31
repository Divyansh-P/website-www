import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { APPS } from '../constants/urls';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { toastNotificationTimeoutOptions } from '../constants/toast-notification';

export default class JoinController extends Controller {
  @service router;
  @service login;
  @service featureFlag;
  @tracked Chaincode = 'Generate Chaincode';
  @tracked isChaincodeClicked = false;
  @tracked isLoading = false;

  queryParams = ['step', 'dev'];

  get isDevMode() {
    return this.featureFlag.isDevMode;
  }

  @action async handleGenerateChaincode(e) {
    e.preventDefault();

    this.isLoading = true;

    try {
      const response = await fetch(`${APPS.API_BACKEND}/users/chaincode`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const { chaincode } = await response.json();

      if (response.ok) {
        this.Chaincode = chaincode;
        this.isChaincodeClicked = true;
        this.toast.info(
          'Generated New Chaincode!!',
          '',
          toastNotificationTimeoutOptions
        );
      } else {
        this.toast.error(
          'Something went wrong. Please check console errors.',
          '',
          toastNotificationTimeoutOptions
        );
      }
    } catch (error) {
      this.toast.error(
        'Something went wrong. Please check console errors.',
        '',
        toastNotificationTimeoutOptions
      );
    } finally {
      this.isLoading = false;
    }
  }
}
