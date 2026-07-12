/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { audio } from '../audio';

export interface AdState {
  isOpen: boolean;
  type: 'interstitial' | 'rewarded' | 'banner';
  placement: string;
  onAdComplete: (rewardEarned: boolean) => void;
}

type AdCallback = (adState: AdState) => void;

class AdsManagerImpl {
  private adListener: AdCallback | null = null;
  private isAdPlayingValue = false;
  private isBannerVisibleValue = false;

  // Registered application-specific event handlers
  private gameplayPauseHandler: (() => void) | null = null;
  private gameplayResumeHandler: (() => void) | null = null;
  private rewardGrantedHandler: ((placement: string) => void) | null = null;
  private rewardDeniedHandler: ((placement: string) => void) | null = null;

  // Active rewarded ad state tracking
  private activePlacement = 'default';
  private wasGameplayPausedByAd = false;

  public setAdListener(listener: AdCallback) {
    this.adListener = listener;
  }

  public removeAdListener() {
    this.adListener = null;
  }

  public isAdPlaying(): boolean {
    return this.isAdPlayingValue;
  }

  public isBannerVisible(): boolean {
    return this.isBannerVisibleValue;
  }

  /**
   * Register callbacks from the React Game Application
   */
  public registerGameplayHandlers(pause: () => void, resume: () => void) {
    this.gameplayPauseHandler = pause;
    this.gameplayResumeHandler = resume;
  }

  public registerRewardHandlers(granted: (placement: string) => void, denied: (placement: string) => void) {
    this.rewardGrantedHandler = granted;
    this.rewardDeniedHandler = denied;
  }

  // =========================================================================
  // REUSABLE SDK AUTOMATED CALLBACKS
  // (Poki, CrazyGames, GameDistribution, Y8 Ready)
  // =========================================================================

  /**
   * Automatically triggered when an ad starts.
   * Handles audio muting, state updating, and pausing the gameplay.
   */
  public onAdStarted() {
    console.log('[SDK Event] onAdStarted: Automatically pausing audio and gameplay.');
    this.isAdPlayingValue = true;

    // 1. AUTOMATICALLY PAUSE AUDIO (Mute music, ambient, and sfx)
    try {
      audio.pauseForAd();
    } catch (err) {
      console.error('[AdsManager] Error pausing audio on ad start:', err);
    }

    // 2. AUTOMATICALLY PAUSE GAMEPLAY (Pause level timer & state if in-game)
    if (this.gameplayPauseHandler) {
      try {
        this.gameplayPauseHandler();
        this.wasGameplayPausedByAd = true;
      } catch (err) {
        console.error('[AdsManager] Error pausing gameplay on ad start:', err);
      }
    }
  }

  /**
   * Automatically triggered when an ad finishes successfully.
   * Restores audio, resumes gameplay, and grants rewards.
   */
  public onAdFinished() {
    console.log('[SDK Event] onAdFinished: Automatically resuming audio and gameplay, granting rewards.');
    this.isAdPlayingValue = false;

    // 1. AUTOMATICALLY RESUME AUDIO
    try {
      audio.resumeAfterAd();
    } catch (err) {
      console.error('[AdsManager] Error resuming audio on ad finish:', err);
    }

    // 2. AUTOMATICALLY RESUME GAMEPLAY
    if (this.gameplayResumeHandler && this.wasGameplayPausedByAd) {
      try {
        this.gameplayResumeHandler();
        this.wasGameplayPausedByAd = false;
      } catch (err) {
        console.error('[AdsManager] Error resuming gameplay on ad finish:', err);
      }
    }

    // 3. AUTOMATICALLY GRANT REWARD
    this.onRewardGranted();
  }

  /**
   * Automatically triggered when an ad is skipped/not fully viewed.
   * Restores audio and gameplay without granting rewards.
   */
  public onAdSkipped() {
    console.log('[SDK Event] onAdSkipped: Automatically resuming audio and gameplay, denying rewards.');
    this.isAdPlayingValue = false;

    // 1. AUTOMATICALLY RESUME AUDIO
    try {
      audio.resumeAfterAd();
    } catch (err) {
      console.error('[AdsManager] Error resuming audio on ad skip:', err);
    }

    // 2. AUTOMATICALLY RESUME GAMEPLAY
    if (this.gameplayResumeHandler && this.wasGameplayPausedByAd) {
      try {
        this.gameplayResumeHandler();
        this.wasGameplayPausedByAd = false;
      } catch (err) {
        console.error('[AdsManager] Error resuming gameplay on ad skip:', err);
      }
    }

    // 3. AUTOMATICALLY DENY REWARD
    this.onRewardDenied();
  }

  /**
   * Automatically grants the reward for the active ad placement.
   */
  public onRewardGranted() {
    console.log(`[SDK Event] onRewardGranted for placement: ${this.activePlacement}`);
    if (this.rewardGrantedHandler) {
      try {
        this.rewardGrantedHandler(this.activePlacement);
      } catch (err) {
        console.error('[AdsManager] Error granting reward:', err);
      }
    }
  }

  /**
   * Automatically denies the reward.
   */
  public onRewardDenied() {
    console.log(`[SDK Event] onRewardDenied for placement: ${this.activePlacement}`);
    if (this.rewardDeniedHandler) {
      try {
        this.rewardDeniedHandler(this.activePlacement);
      } catch (err) {
        console.error('[AdsManager] Error denying reward:', err);
      }
    }
  }

  /**
   * Handle errors during ad loads gracefully.
   */
  public handleAdError(error: any) {
    console.error('[SDK Event] handleAdError: An error occurred during ad display:', error);
    this.isAdPlayingValue = false;
    
    try {
      audio.resumeAfterAd();
    } catch (err) {
      console.error('[AdsManager] Error resuming audio on ad error:', err);
    }

    if (this.gameplayResumeHandler && this.wasGameplayPausedByAd) {
      try {
        this.gameplayResumeHandler();
        this.wasGameplayPausedByAd = false;
      } catch (err) {
        console.error('[AdsManager] Error resuming gameplay on ad error:', err);
      }
    }

    this.onRewardDenied();
  }

  // =========================================================================
  // RECESSED TRIGGER METHODS
  // =========================================================================

  /**
   * Triggers an Interstitial Ad. Resolves when the ad closes.
   */
  public async showInterstitialAd(placement: string = 'default'): Promise<boolean> {
    console.log(`[AdsManager] showInterstitialAd requested for placement: ${placement}`);
    if (this.isAdPlayingValue) {
      console.warn('[AdsManager] Another ad is already active.');
      return false;
    }
    
    this.activePlacement = placement;
    this.onAdStarted();

    return new Promise((resolve) => {
      if (this.adListener) {
        this.adListener({
          isOpen: true,
          type: 'interstitial',
          placement,
          onAdComplete: (success) => {
            if (success) {
              this.onAdFinished();
            } else {
              this.onAdSkipped();
            }
            console.log(`[AdsManager] showInterstitialAd completed for: ${placement}`);
            resolve(true);
          }
        });
      } else {
        // Fallback for non-UI environments
        setTimeout(() => {
          this.onAdFinished();
          resolve(true);
        }, 1500);
      }
    });
  }

  /**
   * Triggers a Rewarded Ad. Resolves to true if player finished watching, false if skipped/failed.
   */
  public async showRewardedAd(placement: string = 'default'): Promise<boolean> {
    console.log(`[AdsManager] showRewardedAd requested for placement: ${placement}`);
    if (this.isAdPlayingValue) {
      console.warn('[AdsManager] Another ad is already active.');
      return false;
    }
    
    this.activePlacement = placement;
    this.onAdStarted();

    return new Promise((resolve) => {
      if (this.adListener) {
        this.adListener({
          isOpen: true,
          type: 'rewarded',
          placement,
          onAdComplete: (rewardEarned) => {
            if (rewardEarned) {
              this.onAdFinished();
            } else {
              this.onAdSkipped();
            }
            console.log(`[AdsManager] showRewardedAd finished for ${placement}. Reward earned: ${rewardEarned}`);
            resolve(rewardEarned);
          }
        });
      } else {
        // Fallback for non-UI environments
        setTimeout(() => {
          this.onAdFinished();
          resolve(true);
        }, 2000);
      }
    });
  }

  /**
   * Triggers a Banner Ad display.
   */
  public async showBannerAd(placement: string = 'default'): Promise<boolean> {
    console.log(`[AdsManager] showBannerAd requested for placement: ${placement}`);
    this.isBannerVisibleValue = true;
    if (this.adListener) {
      this.adListener({
        isOpen: true,
        type: 'banner',
        placement,
        onAdComplete: () => {}
      });
    }
    return true;
  }

  /**
   * Hides the active Banner Ad.
   */
  public async hideBannerAd(): Promise<boolean> {
    console.log('[AdsManager] hideBannerAd requested');
    this.isBannerVisibleValue = false;
    if (this.adListener) {
      this.adListener({
        isOpen: false,
        type: 'banner',
        placement: 'none',
        onAdComplete: () => {}
      });
    }
    return true;
  }
}

export const AdsManager = new AdsManagerImpl();
