import {
  PanelSectionRow,
  PanelSection,
  gamepadDialogClasses,
  joinClassNames,
  Spinner
} from "decky-frontend-lib";
import { Component, Fragment } from "react";

import { ShareDeckProfile } from "./sharedeck";




class PerfDisplayItem extends Component<{ label: string, value: string | number | undefined }, {}> {
  render() {

    return (
      <PanelSectionRow>
        <div className={joinClassNames(gamepadDialogClasses.Field, gamepadDialogClasses.WithBottomSeparatorStandard)}>
          <div className={gamepadDialogClasses.FieldLabelRow}>
            <div className={gamepadDialogClasses.FieldLabel}>
              {this.props.label}
            </div>
            <div className={gamepadDialogClasses.FieldChildren}>
              {this.props.value}
            </div>
          </div>
        </div>
      </PanelSectionRow>
    );
  }
}

export class PerfDisplay extends Component<{ profile: ShareDeckProfile | null, loading: boolean }> {
  render() {
    if(this.props.loading) {
      return (
        <PanelSection>
          <PanelSectionRow>
            <Spinner />
          </PanelSectionRow>
        </PanelSection>
      )
    }

    if (this.props.profile) {
      return (
        <Fragment>
          <PanelSection title="Recommended Steam Deck Settings">
              <PerfDisplayItem label="Expected Power Draw" value={`${this.props.profile?.power_draw}W`} />
              <PerfDisplayItem label="Framerate Limit" value={this.props.profile?.framerate_limit} />
              <PerfDisplayItem label="Expected FPS" value={this.props.profile?.average_framerate} />
              <PerfDisplayItem label="Refresh Rate" value={this.props.profile?.screen_refresh_rate} />
              <PerfDisplayItem label="Halfrate Shading" value={this.props.profile?.halfrate_shading ? "Enabled" : "Disabled"} />
              <PerfDisplayItem label="TDP Limit" value={this.props.profile?.tdp_limit === null ? "Disabled" : `${this.props.profile?.tdp_limit}W`} />
              <PerfDisplayItem label="Manual GPU Clock" value={this.props.profile?.gpu_clock === null ? "Disabled" : this.props.profile?.gpu_clock} />
              <PerfDisplayItem label="Scaling Filter" value={this.props.profile?.scaling_filter} />
          </PanelSection>

          <PanelSection title="Recommended Ingame Settings">
            <div className={joinClassNames(gamepadDialogClasses.Field, gamepadDialogClasses.WithBottomSeparatorStandard)}>
              <PerfDisplayItem label="Graphics Preset" value={this.props.profile?.graphics_preset} />
              <PerfDisplayItem label="Resolution" value={`${this.props.profile?.resolution_horizontal}x${this.props.profile?.resolution_vertical}`} />
            </div>
          </PanelSection>

          <PanelSection>
            <PerfDisplayItem label="Additional Notes" value={this.props.profile?.note === null ? "None" : this.props.profile?.note} />
          </PanelSection>
        </Fragment>
      )
    } else {
      return (
        <PanelSection>
          <PanelSectionRow>
            Please launch a game to see available community profiles.
          </PanelSectionRow>
        </PanelSection>
      )
    }
  }
}